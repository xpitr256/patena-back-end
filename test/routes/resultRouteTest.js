const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const application = require('../../app');
const proxyquire  =  require('proxyquire');
const constants = require('./../../services/constants');

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


describe('/results route',() => {

    const validOrderNumber = '550e8400-e29b-41d4-a716-446655440000';

    it('should return a 400 error for no order number', (done) => {
        chai.request(application)
            .get('/results')
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for empty order number', (done) => {
        chai.request(application)
            .get('/results')
            .query({orderNumber: ''})
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return a 400 error for invalid order number', (done) => {
        chai.request(application)
            .get('/results')
            .query({orderNumber: 'invalid'})
            .end( (err,res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return 500 for internal error', (done) => {
        const resultServiceMock = {
            getResultsFor : async function (orderNumber) {
                return new Promise(((resolve, reject) => {
                    reject("getResultsFor: Failing on purpose");
                }))
            }
        }
        const resultWithMockedResultService = proxyquire('../../routes/results', {
            '../services/resultService': resultServiceMock
        });

        const application = proxyquire('../../app',{
            './routes/results': resultWithMockedResultService
        });

        chai.request(application)
            .get('/results')
            .query({orderNumber: validOrderNumber})
            .end( (err,res) => {
                expect(res).to.have.status(500);
                done();
            });
    });


    it('should get task non existent task', (done) => {

        const taskServiceMock = {
            getTask: async function (taskId) {}
        }
        const resultServiceWithMockedTaskService =  proxyquire('../../services/resultService', {
            './taskService': taskServiceMock
        });

        const resultWithMockedResultService = proxyquire('../../routes/results', {
            '../services/resultService': resultServiceWithMockedTaskService
        });

        const application = proxyquire('../../app',{
            './routes/results': resultWithMockedResultService
        });

        chai.request(application)
            .get('/results')
            .query({orderNumber: validOrderNumber})
            .end( (err,res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.not.null;
                expect(res.body.stateId).to.be.equals(constants.TASK_STATE_NOT_FOUND);
                done();
            });
    });

    describe('with an already finished task', () => {

        const finalSequence = 'GAFAMGKWAHDEAMFPLAQMPV';

        beforeEach(async () => {
            await mockDatabase.createInMemoryDataBase();

            const task = new Task({
                id: validOrderNumber,
                stateId: constants.TASK_STATE_FINISHED,
                typeId: constants.TYPE_DESIGN,
                taskData: {},
                output: {
                    finalSequence: finalSequence
                },
                language: 'en'
            });
            await task.save();
        });

        it('should get the task', (done) => {

            const application = proxyquire('../../app',{});

            chai.request(application)
                .get('/results')
                .query({orderNumber: validOrderNumber})
                .end( (err,res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.not.null;
                    expect(res.body.stateId).to.be.equals(constants.TASK_STATE_FINISHED);
                    expect(res.body.results).to.be.an('Object');
                    expect(res.body.results.finalSequence).to.be.equals(finalSequence);
                    done();
                });
        });

        afterEach(async () => {
            await mockDatabase.destroyInMemoryDataBase();
        });
    });
});