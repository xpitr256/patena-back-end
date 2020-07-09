const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const application = require('../../app');
const proxyquire  =  require('proxyquire');

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

describe('/POST analyze route', () => {

    const validEmail = 'valid@test.com';
    const validSequenceName = 'TestName';
    const validSequenceValue = 'AABBBBBBB';

    it('should return a 400 error for no information', (done) => {
        chai.request(application)
            .post('/analyze')
            .send({})
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for invalid mail', (done) => {
        chai.request(application)
            .post('/analyze')
            .send({
                email: 'invalid'
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for empty sequence', (done) => {
        chai.request(application)
            .post('/analyze')
            .send({
                email: validEmail,
                sequence: {},
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for empty sequence value', (done) => {
        chai.request(application)
            .post('/analyze')
            .send({
                email: validEmail,
                sequence: {
                    name: validSequenceName,
                    value: ''
                },
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for invalid sequence value. (It has "J" a non existent amino acid)', (done) => {
        chai.request(application)
            .post('/analyze')
            .send({
                email: validEmail,
                sequence: {
                    name: validSequenceName,
                    value: 'ABJ'
                },
            })
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    describe('with valid analyze data ', () => {
        before(async () => {
           await mockDatabase.createInMemoryDataBase();
        });

        it('should send valid contact information', (done) => {
            const emailServiceMock = {
                sendWorkInProgressMail: async function(email, language, workType, workId) {
                    expect(email).to.be.equals(validEmail);
                    expect(language).to.be.equals('en');
                }
            }

            const analyzeServiceWithMockedEmailService = proxyquire('../../services/analyzeService', {
                './mail/mailService': emailServiceMock
            })

            const analyzeWithMockedAnalyzeService = proxyquire('../../routes/analyze', {
                '../services/analyzeService': analyzeServiceWithMockedEmailService
            });

            const application = proxyquire('../../app', {
                './routes/analyze': analyzeWithMockedAnalyzeService
            });

            chai.request(application)
                .post('/analyze')
                .send({
                    email: validEmail,
                    sequence: {
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

        after(async () => {
            await mockDatabase.destroyInMemoryDataBase();
        });
    });

});