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

    describe('when getTask by Id', async () => {

        it('should return existent task', async () => {

            const id = '123345';
            let createdTasks = [];

            const taskMock = class TaskMock{
                constructor(data) {
                    this.id = data.id;
                }

                static async find () {
                    return createdTasks;
                }
            };

            createdTasks.push({"_doc": new taskMock({id: id})});

            const taskService = proxyquire('../../services/taskService', {
                '../model/schema/Task': taskMock
            });

            const retrievedTask = await taskService.getTask(id);
            expect(retrievedTask).not.to.be.equals(undefined)
            expect(retrievedTask.id).to.be.equals(id);

        });

        it('should return nothing for non existent task', async () => {

            const id = '123345';
            let createdTasks = [];

            const taskMock = class TaskMock{
                constructor(data) {
                    this.id = data.id;
                }

                static async find () {
                    return createdTasks;
                }
            };

            const taskService = proxyquire('../../services/taskService', {
                '../model/schema/Task': taskMock
            });

            const retrievedTask = await taskService.getTask(id);
            expect(retrievedTask).to.be.equals(undefined)
        });

    });

});
