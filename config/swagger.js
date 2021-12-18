module.exports = {
  openapi: "3.0.2",
  info: {
    version: "1.0.0",
    title: "Patena API",
    description: "Patena API available endpoints",
    contact: {
      name: "Ignacio Sanchez",
      email: "nachoquique@gmail.com ",
    },
  },
  host: "patena-api.herokuapp.com",
  basePath: "/",
  tags: [
    {
      name: "user",
      description: "The following endpoints provides support for end user application Patena frontend",
    },
    {
      name: "admin",
      description: "The following endpoints provides support for Patena administration app",
    },
  ],
  paths: {
    "/analyze": {
      post: {
        tags: ["user"],
        description: "send messages to those responsible ",
        summary: "Send the amino acid sequence to get its properties",
        operationId: "postAnalyze",
        security: [{ Bearer: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestAnalyze",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Return a order number",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseOrderNumber",
                },
              },
            },
          },
          400: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Invalid analyze information (wrong email or invalid sequence)",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorAuthentication",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/linkerLength": {
      get: {
        tags: ["user"],
        summary: "Get length",
        description: "get most likely length by specific distance between aminoacids",
        operationId: "getLength",
        parameters: [
          {
            name: "distance",
            in: "query",
            schema: {
              type: "integer",
              default: 50,
            },
            required: true,
          },
        ],
        responses: {
          200: {
            description: "return length associated to distance",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseLinkerLength",
                },
              },
            },
          },
          400: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorLinkerLength",
                },
                example: {
                  message: "Invalid distance value",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorAuthentication",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/design": {
      post: {
        tags: ["user"],
        description: " ",
        summary: "Send the amino acid sequence to get its properties",
        operationId: "postDesign",
        parameters: [],
        security: [{ Bearer: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestDesign",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Contact form sent ok!",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseOrderNumber",
                },
              },
            },
          },
          400: {
            description: "Invalid contact information",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Invalid analyze information (wrong email or invalid sequence)",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/results": {
      get: {
        tags: ["user"],
        summary: "Get result by order number",
        description: "You can get you can get the results of designing a sequence",
        operationId: "getResultsFor",
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: "orderNumber",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          200: {
            description: "Return result by order number",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseDesignFinishedResult",
                },
              },
            },
          },
          400: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Invalid order number",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/contact": {
      post: {
        tags: ["user"],
        summary: "Send messages to those responsible",
        description: "Send message to those responsible ",
        operationId: "postContact",
        security: [{ Bearer: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestContact",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Contact form sent ok!",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseContact",
                },
              },
            },
          },
          400: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Invalid contact information",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorAuthentication",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/login": {
      post: {
        tags: ["admin"],
        summary: "Admin user login",
        description: "Allows admin user to control panels",
        operationId: "postLogin",
        security: [{ Bearer: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestLogin",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "OK login",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseLogin",
                },
                example: {
                  auth: true,
                  token: "eybasdhasdkaskldaksdkasdkkasd-89sdsadadas",
                },
              },
            },
          },
          404: {
            description: "Empty request body",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Sorry, that user does not appear to exist.",
                },
              },
            },
          },
          401: {
            description: "Not authorized for invalid password",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorWrongPassword",
                },
                example: {
                  auth: false,
                  token: null,
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/tasks": {
      get: {
        tags: ["admin"],
        summary: "Get list of a task by status",
        description: "You can get the detail of a group of tasks",
        operationId: "getTasksFor",
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: "offset",
            in: "query",
            description: "offset",
            type: "integer",
            required: false,
          },
          {
            name: "limit",
            in: "query",
            description: "max limit",
            type: "integer",
            required: false,
          },
          {
            name: "state",
            in: "query",
            description: "task state",
            type: "integer",
            required: false,
          },
        ],
        responses: {
          200: {
            description: "Return details of group of tasks",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseDetailTasks",
                },
                example: [
                  {
                    status: "Finished",
                    duration: "10",
                    type: "Initial Sequence",
                    date: "10/03/2021 10:12 hs",
                  },
                  {
                    status: "Cancelled",
                    duration: "7",
                    type: "No initial data",
                    date: "10/03/2021 00:12 hs",
                  },
                  {
                    status: "In Progress",
                    duration: "-",
                    type: "Only flanking",
                    date: "13/03/2021 04:12 hs",
                  },
                ],
              },
            },
          },
          400: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Invalid task state: ...",
                },
              },
            },
          },
          401: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "invalid token",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/tasks/:id": {
      get: {
        tags: ["admin"],
        summary: "Get an specific task by id",
        description: "You can get the detail of a task",
        operationId: "getTaskForId",
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: "IdTask",
            in: "path",
            description: "unique ID",
            type: "string",
            required: true,
          },
        ],
        responses: {
          200: {
            description: "Return detail of a task",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseDetailTask",
                },
              },
            },
          },
          404: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no task with id: ...",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/tasks/:id/retry": {
      put: {
        tags: ["admin"],
        summary: "Retry a cancelled task",
        description: "You can queue a canceled task",
        operationId: "retryTaskForId",
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: "IdTask",
            in: "path",
            description: "unique ID",
            type: "string",
            required: true,
          },
        ],
        responses: {
          204: {
            description: "The task was retried",
            content: {
              "application/json": {},
            },
          },
          400: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Invalid task status. The task is not cancelled to be retried",
                },
              },
            },
          },
          404: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no task with id: ...",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/statistics/rate": {
      get: {
        tags: ["admin"],
        summary: "Get the current success rate",
        description: "You can get rate success tasks",
        operationId: "Rate success tasks",
        security: [{ Bearer: [] }],
        parameters: [],
        responses: {
          200: {
            description: "Return rate success tasks",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseRateSuccessTasks",
                },
              },
            },
          },
          401: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "invalid token",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/statistics/time/average": {
      get: {
        tags: ["admin"],
        summary: "Get the average processing time of tasks",
        description: "You can the average processing time of tasks",
        operationId: "Average processing time of tasks",
        security: [{ Bearer: [] }],
        parameters: [],
        responses: {
          200: {
            description: "Return the average processing time of tasks",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseAvgTasks",
                },
              },
            },
          },
          401: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "invalid token",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/statistics/time/fastest": {
      get: {
        tags: ["admin"],
        summary: "Get the fastest completed tasks",
        description: "You can get time fastest task",
        operationId: "Time fastest tasks",
        security: [{ Bearer: [] }],
        parameters: [],
        responses: {
          200: {
            description: "Returns the time of the fastest task",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseFastestTask",
                },
              },
            },
          },
          401: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "invalid token",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/statistics/time/slowest": {
      get: {
        tags: ["admin"],
        summary: "Get the slowest completed tasks",
        description: "You can get time slowest task",
        operationId: "Time slowest tasks",
        security: [{ Bearer: [] }],
        parameters: [],
        responses: {
          200: {
            description: "Returns the time of the slowest task",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseSlowestTasks",
                },
              },
            },
          },
          401: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "invalid token",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/statistics/queue/status": {
      get: {
        tags: ["admin"],
        summary: "Get the amount of tasks by status in the queue",
        description: "You can get the number of tasks by status",
        operationId: "Status",
        security: [{ Bearer: [] }],
        parameters: [],
        responses: {
          200: {
            description: "Returns the number of tasks by status",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseQueueStatus",
                },
                example: [
                  { name: "In Progress", value: "2" },
                  { name: "Cancelled", value: "5" },
                  { name: "Finished", value: "35" },
                  { name: "Pending", value: "3" },
                ],
              },
            },
          },
          401: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "invalid token",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
    "/statistics/queue/composition": {
      get: {
        tags: ["admin"],
        summary: "Get the composition of design tasks in the queue",
        description: "You can get the number of tasks by design type",
        operationId: "Composition",
        security: [{ Bearer: [] }],
        parameters: [],
        responses: {
          200: {
            description: "Returns the number of tasks by design type",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseQueueComposition",
                },
                example: [
                  { name: "No initial data", value: "9" },
                  { name: "Initial Sequence", value: "15" },
                  { name: "Only flanking", value: "2" },
                  { name: "Flanking + initial sequence", value: "8" },
                ],
              },
            },
          },
          401: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "invalid token",
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "There is no authorization headers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Error: Internal Server Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      //Request
      RequestAnalyze: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Your email",
            example: "john@example.com",
            required: false,
          },
          language: {
            type: "string",
            description: '"en" or "es" Default: "en"',
            example: "en",
            required: false,
          },
          sequence: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "file name",
                example: "SEQUENCE_1",
                required: true,
              },
              value: {
                type: "string",
                description: "sequence aminoacid",
                example:
                  "MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEGLVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHKMGQFYVMDDKKTVEQVIAEKEKEF",
                required: true,
              },
            },
          },
        },
      },
      RequestDesign: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Your email",
            example: "john@example.com",
            required: false,
          },
          language: {
            type: "string",
            description: 'Default: "en"',
            example: "es",
            required: false,
          },
          distance: {
            type: "integer",
            description: "Value obtanied from the length ",
            example: 50,
            required: true,
          },
          designType: {
            type: "integer",
            description:
              "The initialSequence is required all types design," + "\n\nflankingSequence1 and flankingSequence2 are required for type design 3 or 4",
            example: 4,
            required: true,
          },
          initialSequence: {
            $ref: "#/components/schemas/sequence",
          },
          flankingSequence1: {
            $ref: "#/components/schemas/sequence",
          },
          flankingSequence2: {
            $ref: "#/components/schemas/sequence",
          },
          config: {
            type: "object",
            properties: {
              netCharge: {
                type: "integer",
                description: "Range of values between negative and positive of the distance obtained from the length ",
                example: 0,
                required: false,
              },

              algorithms: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/algorithm",
                },
                example: [
                  { name: "BLAST", active: true },
                  { name: "TANGO", active: true },
                  { name: "ELM", active: true },
                  { name: "IUPred", active: true },
                  { name: "ANCHOR", active: true },
                  { name: "Prosite", active: true },
                  { name: "Limbo", active: true },
                  { name: "TMHMM", active: true },
                  { name: "PASTA", active: true },
                  { name: "Waltz", active: true },
                ],
              },
              frequencies: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/frequency",
                },
                example: [
                  { name: "A", value: 8.2 },
                  { name: "R", value: 5.5 },
                  { name: "N", value: 4 },
                  { name: "D", value: 5.4 },
                  { name: "C", value: 1.4 },
                  { name: "Q", value: 3.9 },
                  { name: "E", value: 6.8 },
                  { name: "G", value: 7.1 },
                  { name: "H", value: 2.3 },
                  { name: "I", value: 6 },
                  { name: "L", value: 9.7 },
                  { name: "K", value: 5.8 },
                  { name: "M", value: 2.4 },
                  { name: "F", value: 3.9 },
                  { name: "P", value: 4.7 },
                  { name: "S", value: 6.7 },
                  { name: "T", value: 5.3 },
                  { name: "W", value: 1.1 },
                  { name: "V", value: 6.9 },
                  { name: "Y", value: 2.9 },
                ],
              },
            },
          },
        },
      },
      RequestContact: {
        type: "object",
        properties: {
          name: {
            description: "Your name",
            type: "string",
            example: "John",
            required: true,
          },
          email: {
            type: "string",
            description: "Your email",
            example: "john@example.com",
            required: true,
          },
          message: {
            type: "string",
            description: "Your message",
            example: "Hello, my name John. I would like to contact a person in charge of the patena system for technical issues.",
            minlength: 50,
            required: true,
          },
        },
      },
      RequestLogin: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Your email",
            example: "john@example.com",
            required: true,
          },
          password: {
            type: "string",
            description: "Your password",
            example: "Passw0rd1234",
            minlength: 8,
            required: true,
          },
        },
      },

      //Response: 200
      ResponseContact: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Status message",
            example: "Contact form sent ok!",
          },
        },
      },
      ResponseLogin: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "",
            example: " auth: true, token: token ",
          },
        },
      },
      ResponseOrderNumber: {
        type: "object",
        properties: {
          orderNumber: {
            type: "string",
            description: "This is order number for to check the status of the task ",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
        },
      },
      ResponseLinkerLength: {
        type: "object",
        properties: {
          length: {
            type: "string",
            description: "The most likely length ",
            example: "25",
          },
          distance: {
            type: "string",
            description: "The distance required",
            example: "50",
          },
        },
      },
      ResponsePendingResult: {
        type: "object",
        description: "Your order in the queue",
        properties: {
          stateId: {
            type: "integer",
            description: "Id status task ",
            example: 1,
          },
          status: {
            type: "string",
            description: "Description status",
            example: "The order is waiting to be processed.",
          },
          orderNumber: {
            type: "string",
            description: "Order number searched",
            example: "55ba5fcd-33b8-4a70-b726-0f06377b6462",
          },
        },
      },
      ResponseInProgressResult: {
        type: "object",
        description: "In progress",
        properties: {
          stateId: {
            type: "integer",
            description: "Id status task ",
            example: 2,
          },
          status: {
            type: "string",
            description: "Description status",
            example: "Your order is being processed right now. Results will be ready very soon.",
          },
          orderNumber: {
            type: "string",
            description: "Order number searched",
            example: "55ba5fcd-33b8-4a70-b726-0f06377b6462",
          },
        },
      },
      ResponseCancelledResult: {
        type: "object",
        description: "the task could not be processed",
        properties: {
          stateId: {
            type: "integer",
            description: "Id status task ",
            example: 4,
          },
          status: {
            type: "string",
            description: "Description status",
            example: "Your order has been cancelled.",
          },
          orderNumber: {
            type: "string",
            description: "Order number searched",
            example: "55ba5fcd-33b8-4a70-b726-0f06377b6462",
          },
        },
      },
      ResponseNotFoundResult: {
        type: "object",
        description: "Order number not found",
        properties: {
          stateId: {
            type: "integer",
            description: "Id status task ",
            example: 0,
          },
          status: {
            type: "string",
            description: "Description status",
            example: "The requested order number was not found. Please try another one.",
          },
          orderNumber: {
            type: "string",
            description: "Order number searched",
            example: "55ba5fcd-33b8-4a70-b726-0f06377b6462",
          },
        },
      },
      ResponseDesignFinishedResult: {
        type: "object",
        description: "Order number not found",
        properties: {
          stateId: {
            type: "integer",
            description: "Id status task ",
            example: 3,
          },
          status: {
            type: "string",
            description: "Description status",
            example: 'The order is successfully finished."',
          },
          orderNumber: {
            type: "string",
            description: "Order number searched",
            example: "55ba5fcd-33b8-4a70-b726-0f06377b6462",
          },
          results: {
            type: "object",
            properties: {
              initialSequence: {
                type: "string",
                example: "WGKLLVTTINKLNSFRQTLTPP",
              },
              mode: {
                type: "string",
                description: "Mode design",
                example: "design",
              },
              initialScore: {
                type: "integer",
                example: 131,
              },
              mutationsHistory: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/mutationHistory",
                },
                example: [
                  {
                    mutated_sequence: "WGKTLVTTINKLNSFRQTLTPP",
                    mutated_position: 3,
                    previous_residue: "L",
                    replacement_aa: "T",
                    method: "score_difference",
                    score_after_mutation: 120,
                  },
                  {
                    mutated_sequence: "WGKTLVTTINKLNSFKQTLTPP",
                    mutated_position: 15,
                    previous_residue: "R",
                    replacement_aa: "K",
                    method: "score_difference",
                    score_after_mutation: 0,
                  },
                ],
              },
              finalScore: {
                type: "integer",
                example: 0,
              },
              finalSequence: {
                type: "string",
                example: "WGKTLVTTINKLNSFKQTLTPP",
              },
            },
          },
        },
      },
      ResponseDetailTask: {
        type: "object",
        description: "Detail of task",
        properties: {
          status: {
            type: "string",
            description: "Description status",
            example: "Cancelled",
          },
          duration: {
            type: "string",
            description: "Time expressed in minutes",
            example: "12",
          },
          type: {
            type: "string",
            example: "Initial Sequence",
          },
          date: {
            type: "string",
            description: "Time expressed in minutes",
            example: "12/03/2021 10:12 hs",
          },
        },
      },
      ResponseDetailTasks: {
        type: "object",
        description: "Detail of task",
        properties: {
          status: {
            type: "string",
            description: "Description status",
            example: "Finished",
          },
          duration: {
            type: "string",
            description: "Time expressed in minutes",
            example: "10",
          },
          type: {
            type: "string",
            example: "Initial Sequence",
          },
          date: {
            type: "string",
            description: "Time expressed in minutes",
            example: "10/03/2021 10:12 hs",
          },
        },
      },
      ResponseRateSuccessTasks: {
        type: "object",
        properties: {
          success_rate: {
            type: "string",
            description: "rate",
            example: "67",
          },
        },
      },
      ResponseAvgTasks: {
        type: "object",
        properties: {
          avg_minutes: {
            type: "string",
            description: "Time in Minutes",
            example: "23",
          },
        },
      },
      ResponseFastestTask: {
        type: "object",
        properties: {
          time_minutes: {
            type: "string",
            description: "Time in Minutes",
            example: "18",
          },
        },
      },
      ResponseSlowestTasks: {
        type: "object",
        properties: {
          time_minutes: {
            type: "string",
            description: "Time in Minutes",
            example: "70",
          },
        },
      },
      ResponseQueueStatus: {
        type: "array",
        oneOf: {
          name: {
            type: "string",
            description: "Category",
          },
          value: {
            type: "string",
            description: "Amount",
          },
        },
      },
      ResponseQueueComposition: {
        type: "array",
        oneOf: {
          name: {
            type: "string",
            description: "Design Type",
          },
          value: {
            type: "string",
            description: "Amount",
          },
        },
      },

      //Response: 400,500..
      ErrorLinkerLength: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "Invalid distance value",
          },
        },
      },
      ErrorAuthentication: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "There is no authorization headers",
          },
        },
      },
      ErrorWrongPassword: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "Not authorized for invalid password",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "not found",
          },
        },
      },

      //Microcomponents
      email: {
        type: "string",
        description: "Your email",
        example: "john@example.com",
      },
      language: {
        type: "string",
        description: 'Language support "en" or "es"',
        example: "en",
      },
      sequence: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "SEQUENCE_1",
          },
          value: {
            type: "string",
            example:
              "MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG\n" +
              "LVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHK\n" +
              "IPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTL\n" +
              "MGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL",
          },
        },
      },
      algorithm: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name algorithm",
          },
          active: {
            type: "boolean",
            example: true,
          },
        },
      },
      frequency: {
        type: "object",
        description: "the sum must be 100%",
        properties: {
          name: {
            type: "string",
            description: "Name algorithm",
          },
          value: {
            type: "boolean",
            example: true,
          },
        },
      },
      mutationHistory: {
        type: "object",
        properties: {
          mutated_sequence: {
            type: "string",
            description: "the sequence consisting of the 20 amino acids ",
          },
          mutated_position: {
            type: "integer",
            description: "number mutated position",
          },
          previous_residue: {
            type: "string",
            description: "Aminoacid to replace",
          },
          replacement_aa: {
            type: "string",
            description: "Aminoacid replaced",
          },
          method: {
            type: "string",
            description: "The replacement method",
          },
          score_after_mutation: {
            type: "integer",
            description: "Score indicator. Zero desirable value",
          },
        },
      },
    },
    securitySchemes: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },
};
