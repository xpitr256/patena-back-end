# PATENA back-end

REST API and job-processing workers behind **PATENA**, a web tool to **analyze and design linker / flexible protein sequences**. The API receives an order, queues it, runs the [PATENA](patena/README.md) Python engine on it and e-mails the user when the result is ready.

![Node](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/python-%3E%3D3.9-3776AB?logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-6.x-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-required-DC382D?logo=redis&logoColor=white)

## Table of contents

- [What problem does it solve](#what-problem-does-it-solve)
- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Running](#running)
- [API](#api)
- [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## What problem does it solve

Designing a protein linker (the segment that joins two domains) means finding an amino-acid sequence that does **not** fold, aggregate, bind chaperones, cross membranes or match known functional motifs. Checking all of that requires running a dozen bioinformatics tools (BLAST, Tango, IUPred, ANCHOR, ELM, Prosite, Limbo, TMHMM, PASTA, Waltz...) and a single design can take minutes to hours.

This service wraps that pipeline so it can be used from a web front-end:

| Task type | What it does |
| --- | --- |
| **Analysis** | Scores an existing sequence with the selected tools. |
| **Design** | Starts from nothing, an initial sequence and/or flanking sequences and iteratively mutates it (Monte Carlo) until the score is acceptable. |

Because runs are long, work is **asynchronous**: the client gets an `orderNumber` immediately and the result is delivered by e-mail and through `GET /results`.

## How it works

```
 Front-end ──POST /analyze, /design──▶  API (Express)  ──▶ MongoDB   (task = PENDING)
                                                              ▲
 Task Analyzer (scheduled, one-shot)  ── reads PENDING tasks ─┘
        │  promotes to IN PROGRESS, cancels overdue ones, enqueues a job
        ▼
     Redis (Bull queue)
        ▼
 Task Executor (worker) ──▶ python patena/patena.py  ──▶ Output/<id>/results.json
        │                                                       │
        └── stores the result in MongoDB, sends the e-mail ◀────┘   (task = FINISHED)
```

1. `POST /analyze` or `POST /design` validates and sanitizes the payload and stores a task.
2. The **Task Analyzer** (`workers/taskAnalyzerWorker.js`) is a one-shot process meant to run on a schedule. Each run it cancels tasks that exceeded `MAX_JOB_EXECUTION_TIME_IN_MS_SECONDS` and, if fewer than `JOB_CONCURRENCY` tasks are in progress, promotes the oldest pending task to the queue (one task per run).
3. The **Task Executor** (`workers/taskExecutorWorker.js`) is a long-running worker that consumes the queue, runs PATENA, retries failing tasks (cancelled after 3 attempts) and notifies the user by e-mail through SendGrid.
4. The front-end polls `GET /results?orderNumber=...`.

Task states: `Pending → In Progress → Finished`, or `Cancelled` (it can be retried from the admin API).

## Project structure

```
.
├── app.js                 Express app (middlewares, routes, Swagger UI at /docs)
├── bin/www                HTTP server entry point
├── config/
│   ├── config.js          Environment-based configuration
│   └── swagger.js         OpenAPI 3 definition
├── routes/                HTTP layer (user endpoints) and routes/admin (admin endpoints)
├── services/              Business logic: tasks, validation, e-mail, statistics, PATENA runner
├── model/                 Mongoose schemas (Task, User), DB connection and Bull queue factory
├── workers/               Task analyzer and task executor processes
├── lang/                  en / es translations used in e-mails and messages
├── views/                 Error page template
├── patena/                PATENA engine (Python) and the third-party tools it runs
│   ├── patena.py          CLI entry point
│   ├── tool_functions.py  One wrapper per tool
│   ├── Tools/             ANCHOR, IUPred, ELM, Limbo, PASTA, Prosite, Tango, TMHMM, Waltz...
│   └── tests/             pytest suite
├── mock/                  Fake PATENA scripts for local development
└── test/                  mocha suite (mirrors the source tree)
```

## Getting started

### Prerequisites

| Requirement | Why |
| --- | --- |
| Node.js **22+** | API and workers |
| MongoDB 6+ | Tasks and admin users |
| Redis | Job queue (Bull) |
| Python **3.9+** and `pip` | PATENA engine |
| `gcc`, `make`, `perl` | Build/run ANCHOR, IUPred, Prosite, Waltz and PASTA |
| A SendGrid API key | Only if you want real e-mails (`SEND_EMAILS=true`) |

BLAST: the back-end runs PATENA with BLAST **web** by default, so no local BLAST database is needed. Using a local `blastp` + UniProt/Swiss-Prot is documented in [patena/README.md](patena/README.md).

> Tango, TMHMM and PASTA ship Linux x86-64 binaries. On macOS/Windows run those tools disabled (see the algorithm switches in `POST /design`) or use Linux/Docker.

### Install

```bash
git clone https://github.com/xpitr256/patena-back-end.git
cd patena-back-end

npm install
python3 -m pip install -r requirements.txt
./patena/install.sh          # compiles ANCHOR and IUPred and exports the tool paths
```

## Configuration

Everything is configured through environment variables; all of them have a development default except the secrets.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/patena` | MongoDB connection string |
| `REDIS_URL` | `redis://127.0.0.1:6379` | Redis connection string |
| `PATENA_QUEUE_NAME` | `patena-v2` | Bull queue name |
| `TOKEN_SECRET` | `patena-secret-token-value` | JWT signing secret. **Change it in production** |
| `TOKEN_EXPIRATION_TIME_IN_HS` | `2` | Lifetime of admin tokens |
| `FRONT_END_NAME` | `patena-web-front-end` | `sub` claim that identifies the public front-end token |
| `FRONT_END_BASE_URL` | `http://localhost:3000/` | Used to build the links sent by e-mail |
| `SEND_EMAILS` | `false` | Must be `"true"` to actually send e-mails |
| `SENDGRID_API_KEY` | – | SendGrid key (starts with `SG.`) |
| `CONTACT_MAIL` | – | Recipient of the contact form |
| `JOB_CONCURRENCY` | `5` | Max tasks running in parallel |
| `WEB_CONCURRENCY` | `1` | Number of executor worker processes |
| `MAX_JOB_EXECUTION_TIME_IN_MS_SECONDS` | `172800000` | Time (ms) after which an in-progress task is cancelled (2 days) |

## Running

Start MongoDB and Redis first (for example `brew services start mongodb-community redis`, or `docker run -p 27017:27017 mongo:6` / `docker run -p 6379:6379 redis`).

```bash
npm start                              # API on http://localhost:3000
node workers/taskExecutorWorker.js     # consumes the queue and runs PATENA
node workers/taskAnalyzerWorker.js     # one-shot: run it periodically (cron, Heroku Scheduler...)
```

Check it is alive and browse the interactive documentation:

```bash
curl http://localhost:3000/              # {"name":"PATENA api","version":"v1"}
open http://localhost:3000/docs          # Swagger UI
```

### Try the full flow locally

```bash
# 1. a token for the public endpoints (same one the front-end uses)
TOKEN=$(node -e 'console.log(require("./services/tokenService").createTokenFor("patena-web-front-end"))')

# 2. request an analysis
curl -X POST http://localhost:3000/analyze \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","sequence":{"name":"my seq","value":"MKVLAAGIVEGGKRDEAS"}}'
# {"orderNumber":"..."}

# 3. let the analyzer pick it up, then check the result
node workers/taskAnalyzerWorker.js
curl "http://localhost:3000/results?orderNumber=<orderNumber>" -H "Authorization: Bearer $TOKEN"
```

### Create an admin user

There is no sign-up endpoint; admins are rows in the `users` collection with a bcrypt-hashed password:

```bash
node -e '
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./model/schema/User");
(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/patena");
  await User.create({ name: "admin", email: "admin@example.com", password: bcrypt.hashSync("change-me", 10) });
  await mongoose.disconnect();
})();'
```

Then `POST /login` with that e-mail and password returns the token used by the admin endpoints.

### Developing without the scientific tools

`mock/` contains stand-ins for `patena.py` (always fails, random failures, variable time, fixed design) so the queue and error handling can be exercised without running real analyses.

## API

The full contract, with request/response schemas, is served at **`/docs`** (source: [`config/swagger.js`](config/swagger.js)).

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/` | – | Name and version |
| `GET` | `/linkerLength?distance=` | – | Linker length for a given distance |
| `POST` | `/analyze` | token | Order the analysis of a sequence |
| `POST` | `/design` | token | Order the design of a sequence |
| `GET` | `/results?orderNumber=` | token | Status/result of an order |
| `POST` | `/contact` | – | Contact form (sends an e-mail) |
| `POST` | `/login` | – | Admin login, returns a JWT |
| `GET` | `/tasks` | token | Paginated list of tasks (`limit`, `offset`, `state`) |
| `GET` | `/tasks/:id` | token | Task detail |
| `PUT` | `/tasks/:id/retry` | token | Re-queue a cancelled task |
| `GET` | `/statistics/rate` | token | Success rate |
| `GET` | `/statistics/time/{average,fastest,slowest}` | token | Processing times |
| `GET` | `/statistics/queue/{status,composition}` | token | Queue status and design-type composition |

Errors are returned as JSON `{ "message": "..." }` with the proper HTTP status (`400` validation, `401/403` auth, `404` not found, `500` internal).

## Authentication

Bearer JWT in the `Authorization` header, signed with `TOKEN_SECRET`:

- **Public front-end token**: `sub` equals `FRONT_END_NAME`, no expiration. Used by the PATENA web app.
- **Admin token**: returned by `POST /login`, expires after `TOKEN_EXPIRATION_TIME_IN_HS` hours.

## Testing

```bash
npm test                 # Node: mocha + chai, in-memory MongoDB (330 tests)
npm run test-cv          # same, with coverage report (nyc)
npm run test:python      # PATENA engine: pytest (external tools are mocked)
npm run prettier         # format the code base
```

- The Node suite starts a throw-away MongoDB with `mongodb-memory-server` (the first run downloads a `mongod` binary into `~/.cache/mongodb-binaries`); Redis, SendGrid and the Python process are mocked, so no external service is needed.
- Python tests need `pip install -r requirements.txt -r requirements-dev.txt`.

## Deployment

The repository is ready for a Heroku-style platform (see the [`Procfile`](Procfile)):

| Process | Command |
| --- | --- |
| `web` | `node ./bin/www` |
| `worker` | `node ./workers/taskExecutorWorker.js` |
| `release` | `chmod u+x patena/install.sh && ./patena/install.sh` |

Also schedule `node workers/taskAnalyzerWorker.js` (e.g. every few minutes) and provision MongoDB and Redis add-ons. Set at least `MONGO_URI`, `REDIS_URL`, `TOKEN_SECRET`, `SEND_EMAILS`, `SENDGRID_API_KEY`, `FRONT_END_BASE_URL` and `CONTACT_MAIL`.

## Troubleshooting

- **`API key does not start with "SG."` on startup** – harmless when `SENDGRID_API_KEY` is not set; e-mails are only sent if `SEND_EMAILS=true`.
- **Tests hang while downloading MongoDB on Apple Silicon** – `npm test` already pins `MONGOMS_VERSION=6.0.14`, which has a native arm64 build. Set the same variable if you run `mocha` directly.
- **A task stays `In Progress` forever** – the executor is not running or crashed; the analyzer will cancel it once it exceeds `MAX_JOB_EXECUTION_TIME_IN_MS_SECONDS` and it can be retried with `PUT /tasks/:id/retry`.
- **Tools that do not run on your OS** – disable them in the request's `config.algorithms`, or run the workers on Linux.

## Credits

The PATENA engine and its integrated tools (ANCHOR, IUPred, ELM, Limbo, PASTA, Prosite, Tango, TMHMM, Waltz) belong to their respective authors and keep their own licenses (see `patena/Tools/*`). PATENA original repository: <https://github.com/ieguinoa/patena>.
