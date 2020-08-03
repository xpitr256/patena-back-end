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
        '/analyze':{
            post:{
                tags: ['CRUD Operations Patena-API'],
                description: 'send messages to those responsible ',
                summary: 'Send the amino acid sequence to get its properties',
                operationId: 'postAnalyze',
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
                        description: 'Return a order number',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/OrderNumber'
                                },
                            }
                        }
                    },
                    '400': {
                        description: 'Error: Bad Request',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'Invalid analyze information (wrong email or invalid sequence)'
                                }
                            }
                        }
                    },
                    '403': {
                        description: 'Error: Forbidden',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorAuthentication'
                                },
                                example: {
                                    message: 'There is no authorization headers'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Error: Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'Error: Internal Server Error'
                                }
                            }
                        }
                    }
                }
            }
        },
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
                                    $ref: '#/components/schemas/ResponseLinkerLength'
                                },
                            }
                        }
                    },
                    '400': {
                        description: 'Error: Bad Request',
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
                    },
                    '403': {
                        description: 'Error: Forbidden',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorAuthentication'
                                },
                                example: {
                                    message: 'There is no authorization headers'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Error: Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'Error: Internal Server Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/design':{
            post:{
                tags: ['CRUD Operations Patena-API'],
                description: 'send messages to those responsible ',
                summary: 'Send the amino acid sequence to get its properties',
                operationId: 'postDesign',
                parameters: [
                ],
                security: [{ Bearer: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/RequestDesign'
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
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'Invalid analyze information (wrong email or invalid sequence)'
                                }
                            }
                        }
                    },
                    '403': {
                        description: 'Error: Forbidden',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'There is no authorization headers'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Error: Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'Error: Internal Server Error'
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
                            example: 'a8a32746-0465-4a60-9318-075b3309500b'
                        },
                        required: true
                    },
                ],
                responses: {
                    '200': {
                        description: 'Return result by order number',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ResponseResult'
                                },
                            }
                        }
                    },
                    '400': {
                        description: 'Error: Bad Request',
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
                    },
                    '403': {
                        description: 'Error: Forbidden',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'There is no authorization headers'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Error: Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'Error: Internal Server Error'
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
                                    $ref: '#/components/schemas/SendContact'
                                },
                            }
                        }
                    },
                    '400': {
                        description: 'Error: Bad Request',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'Invalid contact information'
                                }
                            }
                        }
                    },
                    '403': {
                        description: 'Error: Forbidden',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorAuthentication'
                                },
                                example: {
                                    message: 'There is no authorization headers'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Error: Internal Server Error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error'
                                },
                                example: {
                                    message: 'Error: Internal Server Error'
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
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        description: 'Your email',
                        example: 'john@example.com',
                        required:false

                    },
                    language: {
                        type: 'string', description: '"en" or "es" Default: "en"',
                        example: 'en',
                        required:false

                    },
                    sequence: {
                        type: 'object',
                        properties: {
                            name:{
                                type: 'string',
                                description: 'file name',
                                example:'SEQUENCE_1',
                                required:true
                            },
                            value:{
                                type: 'string',
                                description: 'sequence aminoacid',
                                example:'MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEGLVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHKMGQFYVMDDKKTVEQVIAEKEKEF',
                                required:true
                            }
                        }
                    }
                }
            },
            RequestDesign: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        description: 'Your email',
                        example: 'john@example.com',
                        required:false

                    },
                    language: {
                        type: 'string', description: 'Default: "en"',
                        example: 'es',
                        required:false

                    },
                    designType: {
                        type: 'integer',
                        description:'TYPE:\n\n' +
                            'NO_INITIAL_SEQUENCE = 1\n\n' +
                            'ONLY_INITIAL_SEQUENCE = 2\n\n' +
                            'ONLY_FLANKING_SEQUENCES = 3\n\n' +
                            'INITIAL_AND_FLANKING_SEQUENCES = 4\n\n',
                        example: 1,
                        required:true
                    },
                    config:{
                        type: 'object',
                        properties:{
                            algorithms: {
                                type: 'array',
                                items: {
                                   oneOf: [
                                        {
                                            "$ref": "#/components/schemas/Algorithm"
                                        }
                                    ]
                                },
                                example:[
                                    {name: "BLAST", active: true},
                                    {name: "TANGO", active: true},
                                    {name: "ELM", active: true},
                                    {name: "IUPred", active: true},
                                    {name: "ANCHOR", active: true},
                                    {name: "Prosite", active: true},
                                    {name: "Limbo", active: true},
                                    {name: "TMHMM", active: true},
                                    {name: "PASTA", active: true},
                                    {name: "Waltz", active: true}
                                    ]

                            }
                        }
                    }
                }
            },
            RequestContact: {
                type: 'object', properties: {
                    name: {
                        description: 'Your name',
                        type: 'string',
                        example: 'John',
                        required:true
                    },
                    email: {
                        type: 'string',
                        description: 'Your email',
                        example: 'john@example.com',
                        required:true
                    },
                    message: {
                        type: 'string', description: 'Your message',
                        example: 'Hello, my name John. I would like to contact a person in charge of the patena system for technical issues.',
                        minlength:50,
                        required:true
                    }
                }
            },

            //Response: 200
            SendContact: {
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
                        type: 'string', description: 'This is order number for to check the status of the task ',
                        example: '550e8400-e29b-41d4-a716-446655440000'
                    }
                }
            },
            ResponseLinkerLength: {
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
            ResponseResult: {
                type: 'object',
                description: 'stateId --> NOT_FOUND = 0\n' +
                    'PENDING = 1\n' +
                    'IN_PROGRESS = 2\n' +
                    'FINISHED = 3\n' +
                    'CANCELLED = 4' ,
                properties: {
                    stateId: {
                        type: 'integer', description: 'Id status task ',
                        example: 1
                    },
                    status: {
                        type: 'string', description: 'Description status',
                        example: 'The order is waiting to be processed.'
                    },
                    orderNumber: {
                        type: 'string', description: 'Order number searched',
                        example: "55ba5fcd-33b8-4a70-b726-0f06377b6462"
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
            ErrorAuthentication: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string', description: 'the cause of the error',
                        example: 'There is no authorization headers'
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
            },

            //Microcomponents
            email: {
                type: 'string', description: 'Your email',
                example: 'john@example.com'
            },
            language: {
                type: 'string',
                description: 'Language support "en" or "es"',
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
            },
            Algorithm:{
                type:'object',
                properties:{
                    name: {
                        type: 'string',
                        description: 'Name algorithm',
                    },
                    active: {
                        type: 'boolean',
                        example: true,

                    }
                }
            },
            Config:{
                type: 'object',
                properties:{
                    type: 'array',
                    algorithms: {
                        items:{
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'BLAST'
                                },
                                active: {
                                    type: 'boolean',
                                    example: true
                                }
                            }
                        }
                    },
                    frequencies: {
                        $ref: '#/components/schemas/frequencies'
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