const expect = require('chai').expect;
const proxyquire  =  require('proxyquire');

describe('Task worker', async () => {

    it('should finished ok for a success task run', async () => {

        const mockSuccessTaskRun = function() {
            return new Promise(resolve => {
                resolve();
            });
        };

        const mockWorkerFunctions = {
            exit: function (error) {
                expect(error).to.be.equals(undefined);
            },
            log: function() {},
            error: function() {}
        }

        await proxyquire('../../workers/taskWorker', {
            './taskAnalyzer': mockSuccessTaskRun,
            './workerFunctions': mockWorkerFunctions,
        });
    });

    it('should fail for a failing task run', async () => {

        const mockFailingTaskRun = function() {
            return new Promise((resolve, reject) => {
                reject("Failing task");
            });
        };

        const mockWorkerFunctions = {
            exit: function (error) {
                expect(error).to.be.equals(1);
            },
            log: function() {},
            error: function() {}
        }

        await proxyquire('../../workers/taskWorker', {
            './taskAnalyzer': mockFailingTaskRun,
            './workerFunctions': mockWorkerFunctions,
        });
    });
});