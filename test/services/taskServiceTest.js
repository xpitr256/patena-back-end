const expect = require('chai').expect;
const proxyquire  =  require('proxyquire').noCallThru();
const constants = require('../../services/constants');

describe('Task Service', async () => {

    const mockLogger = {
        log: function() {},
        error: function() {}
    }

    describe('when create a new Task', async () => {

        it('should successfully persist a new Task', () => {

            const id = '123345';
            const newTaskData = {
                language: 'en'
            }
            let createdTask;

            const taskMock = class TaskMock{
                constructor(data) {
                    this.id = data.id;
                    this.stateId = data.stateId;
                    this.typeId = data.typeId;
                    this.taskData = data.taskData;
                    this.language = data.taskData.language;
                }

                async save () {
                    createdTask = this;
                }
            };

            const taskService = proxyquire('../../services/taskService', {
                '../model/schema/Task': taskMock,
                './log/logService': mockLogger
            });

            taskService.create(id, newTaskData, constants.TYPE_ANALYSIS);
            expect(createdTask.id).to.be.equals(id);
            expect(createdTask.stateId).to.be.equals(constants.STATE_PENDING);
            expect(createdTask.typeId).to.be.equals(constants.TYPE_ANALYSIS);
            expect(createdTask.language).to.be.equals('en');
        });

        it('should not persist a new Task if BD fails', () => {

            const id = '123345';
            const newTaskData = {
                language: 'en'
            }
            let createdTask;

            const taskMock = class TaskMock{
                constructor(data) {}
                async save () {
                    return new Promise((resolve,reject) => {
                        reject("Save Task failure");
                    })
                }
            };

            const taskService = proxyquire('../../services/taskService', {
                '../model/schema/Task': taskMock,
                './log/logService': mockLogger
            });

            taskService.create(id, newTaskData, constants.TYPE_ANALYSIS);
            expect(createdTask).to.be.equals(undefined);
        });
    });
});
