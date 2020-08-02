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
                                    $ref: '#/components/schemas/ErrorAnalyze'
                                },
                                example: {
                                    message: 'Invalid analyze information (wrong email or invalid sequence)'
                                }
                            }
                        }
                    },
                    '401': {
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
                    },
                    '403': {
                        description: 'Error: Forbidden',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorAnalyze'
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
                                    $ref: '#/components/schemas/ErrorContact'
                                },
                                example: {
                                    message: 'Invalid contact information'
                                }
                            }
                        }
                    },
                    '401': {
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
                    },
                    '403': {
                        description: 'Error: Forbidden',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorAnalyze'
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
                type: 'object',properties: {
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
                        type: 'string',
                        description: 'sequence aminoacid',
                        example:'MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEGLVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHKMGQFYVMDDKKTVEQVIAEKEKEF',
                        required:true

                    }
                }
            },
            RequestDesign: {
                properties: {
                    designType: {
                        $ref: '#/components/schemas/DesignType'
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
            DesignTypeNothing:{
                type:'object',
                properties:{
                    distance:{
                        $ref: '#/components/schemas/distance',
                        required: true
                    },
                    email: {
                        $ref: '#/components/schemas/email'
                    },
                    language: {
                        $ref: '#/components/schemas/language',
                        required: true
                    },
                    designType:{
                        $ref: '#/components/schemas/DesignType',
                        required: true
                    },
                    config:{
                        type:'object',
                        $ref: '#/components/schemas/Config',
                    }

                },

                //Microcomponents
                email: {
                    type: 'string',
                    description: 'Your email',
                    default: 'john@example.com',
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
                },

                distance: {
                    type: 'integer', description: 'The distance required',
                    example: 50
                },

                DesignType:{
                    type: 'integer',
                    description:
                        ' 1- No data, ' +
                        '2- with sequence initial, ' +
                        '3- with flanking sequences ' +
                        '4- with sequence initial and flanking sequences',
                    example: 1
                },
                algorithms:{
                    type:'array',
                    description: 'Set config algorithms',
                    example:[{"active":true,"name":"BLAST"},{"active":true,"name":"TANGO"},{"active":true,"name":"ELM"},{"active":true,"name":"IUPred"},{"active":true,"name":"ANCHOR"},{"active":true,"name":"Prosite"},{"active":true,"name":"Limbo"},{"active":true,"name":"TMHMM"},{"active":true,"name":"PASTA"},{"active":true,"name":"Waltz"},{"active":true,"name":"Amyloid pattern"}]
                },
                frequencies:{
                    type:'array',
                    description: 'Set config aminoacid`s frequency',
                    example:[{"name":"A","value":8.2},{"name":"R","value":5.5},{"name":"N","value":4},{"name":"D","value":5.4},{"name":"C","value":1.4},{"name":"Q","value":3.9},{"name":"E","value":6.8},{"name":"G","value":7.1},{"name":"H","value":2.3},{"name":"I","value":6},{"name":"L","value":9.7},{"name":"K","value":5.8},{"name":"M","value":2.4},{"name":"F","value":3.9},{"name":"P","value":4.7},{"name":"S","value":6.7},{"name":"T","value":5.3},{"name":"W","value":1.1},{"name":"Y","value":2.9},{"name":"V","value":6.9}]
                }
            },
            Config:{ type: 'object',
                properties:{
                    algorithms: {
                        $ref: '#/components/schemas/algorithms'
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