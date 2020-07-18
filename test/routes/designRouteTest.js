const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const application = require('../../app');
const proxyquire  =  require('proxyquire');
const constants = require('../../services/constants');

const mockLogger = {
    log: function() {},
    error: function() {}
}
const databaseWithMockLogger = proxyquire('../../model/database', {
    '../services/log/logService': mockLogger
});

const mockDatabase = proxyquire('../model/databaseTestHelper', {
    './../../model/database': databaseWithMockLogger
});

const Task = require('../../model/schema/Task');

describe('/POST design route', () => {

    const validEmail = 'valid@test.com';
    const validSequenceName = 'TestName';
    const validSequenceValue = 'AACCCCCCC';

    it('should return a 400 error for no design information', (done) => {
        chai.request(application)
            .post('/design')
            .send({})
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for invalid design type', (done) => {
        chai.request(application)
            .post('/design')
            .send({
                designType: 'invalid'
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for 0 (non 1-4) design type', (done) => {
        chai.request(application)
            .post('/design')
            .send({
                designType: 0
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for 5 (non 1-4) design type', (done) => {
        chai.request(application)
            .post('/design')
            .send({
                designType: 5
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for invalid mail', (done) => {
        chai.request(application)
            .post('/design')
            .send({
                designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
                email: 'invalid'
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for no initial sequence', (done) => {
        chai.request(application)
            .post('/design')
            .send({
                email: validEmail,
                designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for empty sequence value', (done) => {
        chai.request(application)
            .post('/design')
            .send({
                email: validEmail,
                designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
                initialSequence: {
                    name: validSequenceName,
                    value: ''
                },
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for invalid initial sequence value. (It has "J" a non existent amino acid)', (done) => {
        chai.request(application)
            .post('/design')
            .send({
                email: validEmail,
                designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
                initialSequence: {
                    name: validSequenceName,
                    value: 'ABJ'
                },
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    describe('with valid design data ', () => {
        beforeEach(async () => {
           await mockDatabase.createInMemoryDataBase();
        });

        it('should save the design Task', (done) => {
            const emailServiceMock = {
                sendWorkInProgressMail: async function(email, language, workType, workId) {
                    expect(email).to.be.equals(validEmail);
                    expect(language).to.be.equals('en');
                    expect(workType).to.be.equals(constants.TYPE_DESIGN);
                }
            }

            const designServiceWithMockedEmailService = proxyquire('../../services/designService', {
                './mail/mailService': emailServiceMock
            })

            const designWithMockedDesignService = proxyquire('../../routes/design', {
                '../services/designService': designServiceWithMockedEmailService
            });

            const application = proxyquire('../../app', {
                './routes/design': designWithMockedDesignService
            });

            chai.request(application)
                .post('/design')
                .send({
                    email: validEmail,
                    designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
                    initialSequence: {
                        name: validSequenceName,
                        value: validSequenceValue
                    },
                })
                .end( async (err,res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.orderNumber).to.be.lengthOf(36);
                    const createdTasks = await Task.countDocuments();
                    expect(createdTasks).to.be.equals(1);
                    done();
                });
        });

        it('should not save the design task if designAnalysis from design service fails', (done) => {

            const designServiceMock = {
                createDesign: async function (data) {
                    return new Promise(((resolve, reject) => {
                        reject('Failing on purpose');
                    }))
                }
            }

            const designWithFailingMockedDesignService = proxyquire('../../routes/design', {
                '../services/designService': designServiceMock
            });

            const application = proxyquire('../../app', {
                './routes/design': designWithFailingMockedDesignService
            });

            chai.request(application)
                .post('/design')
                .send({
                    email: validEmail,
                    designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
                    initialSequence: {
                        name: validSequenceName,
                        value: validSequenceValue
                    },
                })
                .end( async (err,res) => {
                    expect(res).to.have.status(500);
                    const createdTasks = await Task.countDocuments();
                    expect(createdTasks).to.be.equals(0);
                    done();
                });
        });


        afterEach(async () => {
            await mockDatabase.destroyInMemoryDataBase();
        });
    });

});