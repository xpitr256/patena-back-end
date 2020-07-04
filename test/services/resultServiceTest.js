const expect = require('chai').expect;
const proxyquire  =  require('proxyquire');
const constants = require('./../../services/constants');

describe('Result Service', () => {

    it('should return an empty task for non existent order number', async () => {
        const taskServiceMock = {
            getTask: async function(orderNumber) {}
        }
        const resultService = proxyquire('../../services/resultService', {
            './taskService': taskServiceMock
        });
        const orderNumber = '550e8400-e29b-41d4-a716-446655440000';
        const task = await resultService.getResultsFor(orderNumber);
        expect(task).not.to.be.undefined;
        expect(task.stateId).to.be.equals(constants.TASK_STATE_NOT_FOUND);
    });


    it('should return a finished task with results', async () => {
        const taskServiceMock = {
            getTask: async function(orderNumber) {
                return {
                    stateId: constants.TASK_STATE_FINISHED,
                    orderNumber: orderNumber,
                    output: {
                        sequence: "ABC"
                    }
                }
            }
        }
        const resultService = proxyquire('../../services/resultService', {
            './taskService': taskServiceMock
        });
        const orderNumber = '550e8400-e29b-41d4-a716-446655440000';
        const task = await resultService.getResultsFor(orderNumber);
        expect(task).not.to.be.undefined;
        expect(task.stateId).to.be.equals(constants.TASK_STATE_FINISHED);
        expect(task.results).not.to.be.undefined;
        expect(task.results.sequence).to.be.equals('ABC');
    });

});