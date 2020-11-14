const tokenService = require("../services/tokenService");
const config = require("./config");

module.exports = {
  openapi: "3.0.0",
  info: {
    version: "0.0.1",
    title: "Patena-API",
    description: "CRUD Patena-API",
    termsOfService: "https://patena.herokuapp.com/",
    contact: {
      name: "Ignacio Sanchez",
      email: "nachoquique@gmail.com ",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/",
      description: "Local server",
    },
    {
      url: "https://api_url_testing",
      description: "Testing server",
    },
    {
      url: "https://patena-api.herokuapp.com/",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "CRUD Operations Patena-API",
    },
  ],
  paths: {
    "/analyze": {
      post: {
        tags: ["CRUD Operations Patena-API"],
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
        tags: ["CRUD Operations Patena-API"],
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
        tags: ["CRUD Operations Patena-API"],
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
        tags: ["CRUD Operations Patena-API"],
        summary: "Get result by order number",
        description: "You can get you can get the results of analyzing or designing a sequence",
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
        tags: ["CRUD Operations Patena-API"],
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
