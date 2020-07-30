const tokenService = require("../services/tokenService");
const config = require("./config");

module.exports = {

  openapi: '3.0.1',
  info: {
    version: '0.0.1',
    title: 'Patena-API',
    description: 'CRUD Patena-API',
    termsOfService: 'https://patena.herokuapp.com/',
    contact: {
      name: 'Ignacio Sanchez',
      email: 'nachoquique@gmail.com '
    }
  },
  servers:
      [
        {
          url: 'http://localhost:3000/',
          description: 'Local server'
        },
        {
          url: 'https://api_url_testing',
          description: 'Testing server'
        },
        {
          url: 'https://patena.herokuapp.com/',
          description: 'Production server'
        }
      ],
  tags: [
    {
      name: 'CRUD Operations Patena-API'
    }],
  paths: {
    '/linkerLength': {
      get: {
        tags: ['CRUD Operations Patena-API'],
        summary: 'Get length',
        description: 'get most likely length by specific distance between aminoacids',
        operationId: 'getLength',
        parameters: [
          {
            name: 'distance',
            in: 'query',
            schema: {
              type: 'integer',
              default: 50
            },
            required: true
          },
        ],
        responses: {
          '200': {
            description: 'return length associated to distance',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LinkerLength'
                },
              }
            }
          },
          '400': {
            description: 'Invalid distance value',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorLinkerLength'
                },
                example: {
                  message: 'Invalid distance value'
                }
              }
            }
          }
        }
      }
    },
    '/contact':{
      post:{
        tags: ['CRUD Operations Patena-API'],
        summary: 'Send messages to those responsible',
        description: 'Send message to those responsible ',
        operationId: 'postContact',
        security: [{ Bearer: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RequestContact'
              }
            }
          },
          required: true
        },
        responses: {
          '200': {
            description: 'Contact form sent ok!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Contact'
                },
              }
            }
          },
          '400': {
            description: 'Invalid contact information',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorContact'
                },
                example: {
                  message: 'Invalid contact information'
                }
              }
            }
          }
        }
      }
    },
    '/analyze':{
      post:{
        tags: ['CRUD Operations Patena-API'],
        description: 'send messages to those responsible ',
        summary: 'Send the amino acid sequence to get its properties',
        operationId: 'postAnalyze',
        parameters: [
        ],
        security: [{ Bearer: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RequestAnalyze'
              }
            }
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Contact form sent ok!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrderNumber'
                },
              }
            }
          },
          '400': {
            description: 'Invalid contact information',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorAnalyze'
                },
                example: {
                  message: 'Invalid analyze information (wrong email or invalid sequence)'
                }
              }
            }
          }
        }
      }
    },
    '/results': {
      get: {
        tags: ['CRUD Operations Patena-API'],
        summary: 'Get result by order number',
        description: 'You can get you can get the results of analyzing or designing a sequence',
        operationId: 'getResultsFor',
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: 'orderNumber',
            in: 'query',
            schema: {
              type: 'string',
              default: 'a8a32746-0465-4a60-9318-075b3309500b'
            },
            required: true
          },
        ],
        responses: {
          '200': {
            description: 'return result by order number',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DesignResultPending'
                },
              }
            }
          },
          '400': {
            description: 'Error result design',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: '-'
                }
              }
            }
          }
        }
      }
    },
  },
    components: {
        schemas: {

            //Request
            RequestAnalyze: {
                properties: {
                    email: {
                        $ref: '#/components/schemas/email'
                    },
                    language: {
                        $ref: '#/components/schemas/language'
                    },
                    sequence: {
                        $ref: '#/components/schemas/Sequence'
                    }
                }
            },
            RequestContact: {
                type: 'object', properties: {
                    name: {
                        type: 'string', description: 'Your name',
                        example: 'John'
                    },
                    email: {
                        $ref: '#/components/schemas/email'
                    },
                    message: {
                        type: 'string', description: 'Your message',
                        example: 'Hello, my name John. I would like to contact a person in charge of the patena system for technical issues.'
                    }
                }
            },

            //Response: 200
            Contact: {
                type: 'object', properties: {
                    message: {
                        type: 'string', description: 'Status message',
                        example: 'Contact form sent ok!'
                    }
                }
            },
            OrderNumber: {
                type: 'object', properties: {
                    orderNumber: {
                        type: 'string', description: 'Order number to check the status of the task ',
                        example: '550e8400-e29b-41d4-a716-446655440000'
                    }
                }
            },
            LinkerLength: {
                type: 'object', properties: {
                    length: {
                        type: 'string', description: 'The most likely length ',
                        example: '25'
                    },
                    distance: {
                        type: 'string', description: 'The distance required',
                        example: '50'
                    }
                }
            },
            DesignResultNotFound: {
                type: 'object', properties: {
                    stateId: {
                        type: 'integer', description: 'Id status task ',
                        example: 0
                    },
                    status: {
                        type: 'string', description: 'Description status',
                        example: 'The order was not found.'
                    }
                }
            },
            DesignResultPending: {
                type: 'object', properties: {
                    stateId: {
                        type: 'integer', description: 'Id status task ',
                        example: 1
                    },
                    status: {
                        type: 'string', description: 'Description status',
                        example: 'The order is waiting to be processed.'
                    }
                }
            },


            //Response: 400,500..
            ErrorLinkerLength: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string', description: 'the cause of the error',
                        example: 'Invalid distance value'
                    }
                }
            },
            ErrorContact: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string', description: 'the cause of the error',
                        example: 'Invalid contact information'
                    }
                }
            },
            ErrorAnalyze: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string', description: 'the cause of the error',
                        example: 'Invalid analyze information (wrong email or invalid sequence)'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string', description: 'the cause of the error',
                        example: 'not found'
                    }
                },

                //Microcomponents
                email: {
                    type: 'string', description: 'Your email',
                    example: 'john@example.com'
                },
                language: {
                    type: 'string', description: 'Language support "en" or "es"',
                    example: 'en'
                },
                Sequence: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            example: 'SEQUENCE_1'
                        },
                        value: {
                            type: 'string',
                            example: 'MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG\n' +
                                'LVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHK\n' +
                                'IPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTL\n' +
                                'MGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL'
                        }
                    }
                }
            },

            //Microcomponents
            email: {
                type: 'string', description: 'Your email',
                example: 'john@example.com'
            },
            language: {
                type: 'string', description: 'Language support "en" or "es"',
                example: 'en'
            },
            Sequence: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        example: 'SEQUENCE_1'
                    },
                    value: {
                        type: 'string',
                        example: 'MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG'
                    }
                }
            }
        },
        securitySchemes: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        }
    },
}