const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const proxyquire  =  require('proxyquire');
const constants = require('./../../services/constants');

describe('Patena Service', async () => {

    const orderNumber = '550e8400-e29b-41d4-a716-446655440000';

    it('should run Patena for ANALYSIS with default config settings if Task has no config defined ', async () => {
        const pythonShellMock = class PythonShellMock {
            static run (path, options, callBack) {

                expect(options).not.to.be.undefined;

                expect(options.mode).to.be.equals('text');
                expect(options.args).to.be.length.greaterThan(0);

                const hasJobIdParameter = options.args.includes('--jobid=' + orderNumber);
                expect(hasJobIdParameter).to.be.true;

                const hasJsonParameter = options.args.includes('--json');
                expect(hasJsonParameter).to.be.true;

                const hasEvaluationOnlyParameter = options.args.includes('--evaluation-only');
                expect(hasEvaluationOnlyParameter).to.be.true;

                const hasSequenceParameter = options.args.includes('--seq=ABC');
                expect(hasSequenceParameter).to.be.true;
                callBack();
            }
        };
        const patenaService = proxyquire('../../services/patenaService', {
            'python-shell': pythonShellMock
        });
        const task = {
            id: orderNumber,
            typeId: constants.TYPE_ANALYSIS,
            taskData: {
                sequence: {
                    value: 'ABC'
                }
            }
        }
        await patenaService.start(task);
    });


    it('should run Patena for DESIGN => DESIGN_TYPE_ONLY_INITIAL_SEQUENCE with default config settings if Task has no config defined ', async () => {
        const pythonShellMock = class PythonShellMock {
            static run (path, options, callBack) {

                expect(options).not.to.be.undefined;

                expect(options.mode).to.be.equals('text');
                expect(options.args).to.be.length.greaterThan(0);

                const hasJobIdParameter = options.args.includes('--jobid=' + orderNumber);
                expect(hasJobIdParameter).to.be.true;

                const hasJsonParameter = options.args.includes('--json');
                expect(hasJsonParameter).to.be.true;

                const hasSequenceParameter = options.args.includes('--seq=DEF');
                expect(hasSequenceParameter).to.be.true;
                callBack();
            }
        };
        const patenaService = proxyquire('../../services/patenaService', {
            'python-shell': pythonShellMock
        });
        const task = {
            id: orderNumber,
            typeId: constants.TYPE_DESIGN,
            taskData: {
                designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
                initialSequence: {
                    value: 'DEF'
                }
            }
        }
        await patenaService.start(task);
    });

    it('should run Patena for DESIGN => DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES combining last 10 positions from flankingSequence1 and first 10 position from flankingSequence2', async () => {
        const pythonShellMock = class PythonShellMock {
            static run (path, options, callBack) {

                expect(options).not.to.be.undefined;

                expect(options.mode).to.be.equals('text');
                expect(options.args).to.be.length.greaterThan(0);

                const hasJobIdParameter = options.args.includes('--jobid=' + orderNumber);
                expect(hasJobIdParameter).to.be.true;

                const hasJsonParameter = options.args.includes('--json');
                expect(hasJsonParameter).to.be.true;

                const hasSequenceParameter = options.args.includes('--seq=BBBBBBBBBBCCCDDDDDDDDDD');
                expect(hasSequenceParameter).to.be.true;

                callBack();
            }
        };
        const patenaService = proxyquire('../../services/patenaService', {
            'python-shell': pythonShellMock
        });
        const task = {
            id: orderNumber,
            typeId: constants.TYPE_DESIGN,
            taskData: {
                designType: constants.DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES,
                flankingSequence1: {
                    value: 'AABBBBBBBBBB'
                },
                initialSequence: {
                    value: 'CCC'
                },
                flankingSequence2: {
                    value: 'DDDDDDDDDDEE'
                },
            }
        }
        await patenaService.start(task);
    });

    it('should run Patena for DESIGN => DESIGN_TYPE_ONLY_FLANKING_SEQUENCES combining last 10 positions from flankingSequence1 + random amino acids + and first 10 position from flankingSequence2', async () => {
        const pythonShellMock = class PythonShellMock {
            static run (path, options, callBack) {

                expect(options).not.to.be.undefined;

                expect(options.mode).to.be.equals('text');
                expect(options.args).to.be.length.greaterThan(0);

                const hasJobIdParameter = options.args.includes('--jobid=' + orderNumber);
                expect(hasJobIdParameter).to.be.true;

                const hasJsonParameter = options.args.includes('--json');
                expect(hasJsonParameter).to.be.true;


                const sequenceParameters = options.args.filter((arg) => {
                    return arg.startsWith('--seq=BBBBBBBBBB')
                });
                expect(sequenceParameters).to.be.lengthOf(1);

                const sequenceParameter = sequenceParameters[0];
                expect(sequenceParameter).to.be.lengthOf(29);

                callBack();
            }
        };
        const patenaService = proxyquire('../../services/patenaService', {
            'python-shell': pythonShellMock
        });
        const task = {
            id: orderNumber,
            typeId: constants.TYPE_DESIGN,
            taskData: {
                designType: constants.DESIGN_TYPE_ONLY_FLANKING_SEQUENCES,
                flankingSequence1: {
                    value: 'AABBBBBBBBBB'
                },
                distance: 10, // length will be 3
                flankingSequence2: {
                    value: 'DDDDDDDDDDEE'
                },
            }
        }
        await patenaService.start(task);
    });

    it('should run Patena for DESIGN => DESIGN_TYPE_NO_INITIAL_SEQUENCE with random amino acids', async () => {
        const pythonShellMock = class PythonShellMock {
            static run (path, options, callBack) {

                expect(options).not.to.be.undefined;

                expect(options.mode).to.be.equals('text');
                expect(options.args).to.be.length.greaterThan(0);

                const hasJobIdParameter = options.args.includes('--jobid=' + orderNumber);
                expect(hasJobIdParameter).to.be.true;

                const hasJsonParameter = options.args.includes('--json');
                expect(hasJsonParameter).to.be.true;

                const hasLengthParameter = options.args.includes('--length=4');
                expect(hasLengthParameter).to.be.true;

                callBack();
            }
        };
        const patenaService = proxyquire('../../services/patenaService', {
            'python-shell': pythonShellMock
        });
        const task = {
            id: orderNumber,
            typeId: constants.TYPE_DESIGN,
            taskData: {
                designType: constants.DESIGN_TYPE_NO_INITIAL_SEQUENCE,
                distance: 11, // length will be 4
            }
        }
        await patenaService.start(task);
    });


    it('should return an error if Patena fails', async () => {
        const mockLogger = {
            log: function() {},
            error: function() {}
        }

        const pythonShellMock = class PythonShellMock {
            static run (path, options, callBack) {
                callBack("Failing on purpose");
            }
        };
        const patenaService = proxyquire('../../services/patenaService', {
            'python-shell': pythonShellMock,
            './log/logService': mockLogger
        });
        const task = {
            id: orderNumber,
            typeId: constants.TYPE_DESIGN,
            taskData: {
                designType: constants.DESIGN_TYPE_NO_INITIAL_SEQUENCE,
                distance: 1,
            }
        }

        await expect(patenaService.start(task)).to.be.rejected;
    });


    it('should run Patena with custom config parameters if Task includes config', async () => {
        const pythonShellMock = class PythonShellMock {
            static run (path, options, callBack) {

                expect(options).not.to.be.undefined;

                expect(options.mode).to.be.equals('text');
                expect(options.args).to.be.length.greaterThan(0);

                const hastNetChargeParameter = options.args.includes('--net-charge=7');
                expect(hastNetChargeParameter).to.be.true;

                const hastExcludeBLASTParameter = options.args.includes('--noblast');
                expect(hastExcludeBLASTParameter).to.be.true;

                const hastFrequencyHHParameter = options.args.includes('-hh=0.7');
                expect(hastFrequencyHHParameter).to.be.true;

                const hastFrequencyAParameter = options.args.includes('-a=0.3');
                expect(hastFrequencyAParameter).to.be.true;

                callBack();
            }
        };
        const patenaService = proxyquire('../../services/patenaService', {
            'python-shell': pythonShellMock
        });
        const task = {
            id: orderNumber,
            typeId: constants.TYPE_DESIGN,
            taskData: {
                designType: constants.DESIGN_TYPE_NO_INITIAL_SEQUENCE,
                distance: 11,
                config: {
                    netCharge: 7,
                    algorithms: [
                        {
                            name: 'BLAST',
                            active: false
                        },
                        {
                            name: 'PASTA',
                            active: true
                        }
                    ],
                    frequencies: [
                        {
                            name: 'H',
                            value: 0.7
                        },
                        {
                            name: 'A',
                            value: 0.3
                        }
                    ]
                }
            }
        }
        await patenaService.start(task);
    });
});