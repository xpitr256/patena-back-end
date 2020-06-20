const chai = require("chai");
const expect = require('chai').expect;
const proxyquire  =  require('proxyquire');
const constants = require ('../../services/constants');
const translationService = require ('../../services/translationService');

const DEBUG_MODE = false;

function log(message) {
    if (DEBUG_MODE) {
        console.log(message);
    }
}

let databaseMock = {};
databaseMock.connect = function () {
    log("databaseMock:: connected OK!");
}

let taskServiceMock = {};
taskServiceMock.getTaskInProgress = function () {
    log("taskServiceMock:: getTaskInProgress => undefined");
}

taskServiceMock.getNextPendingTask = function () {
    log("taskServiceMock:: getNextPendingTask => undefined");
}

taskServiceMock.promoteTaskToInProgress = function (task) {
    log("taskServiceMock:: promoteTaskToInProgress => updated task");
    task.stateId = constants.STATE_IN_PROGRESS;
    return task;
}

let emailServiceMock = {};
emailServiceMock.sendWorkSuccessMail = function(email, language, workType, workId) {
    log("emailServiceMock:: sendWorkSuccessMail => sent OK");
}


const start = proxyquire('../../workers/taskAnalyzer', {
    './../model/database': databaseMock,
    './../services/taskService': taskServiceMock,
});


describe('Task analyzer worker',() => {

    it('should do nothing when no task is pending ', async () => {
        const result = await start();
        expect(result).to.be.equals(undefined);
    });

    it('should promote task to "in progress" for pending task', async () => {

        let task = {
            stateId: constants.STATE_PENDING,
            taskData: {}
        };

        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }

        taskServiceMock.runTask = function (task) {
            log("taskServiceMock:: runTask => nothing");
        }

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock
        });

        await start();

        expect(task.stateId).to.be.equals(constants.STATE_IN_PROGRESS);
    });


    it('should mark email sent and sent email date for a successful task run with email', async () => {

        let task = {
            stateId: constants.STATE_PENDING,
            taskData: {
                email: "test_email@test.com"
            }
        };

        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.runTask = function (task) {
            log("taskServiceMock:: runTask => nothing");
        }
        taskServiceMock.updateSentEmailNotification = function(task) {
            log("taskServiceMock:: updateSentEmailNotification => updated task");
            task.emailSent = true;
            task.sentEmailDate = new Date();
        }

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
            './../services/mail/mailService': emailServiceMock
        });

        await start();

        expect(task.emailSent).to.be.true;
        expect(task.sentEmailDate).to.be.an('Date');
    });

    it('should update a failing task by increasing its attempts and saving error message', async () => {

        const errorMessage = "FAILING ON PURPOSE";

        let task = {
            stateId: constants.STATE_PENDING,
            attempts: 0,
        };

        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }

        taskServiceMock.runTask = function (task) {
            log("taskServiceMock:: runTask => FAILED");
            return new Promise((resolve, reject) => {
                reject(errorMessage);
            });
        }

        taskServiceMock.updateFailingTask = function(task, error) {
            log("taskServiceMock:: updateFailingTask => ok");
            task.attempts = task.attempts + 1;
            task.messageError = error;
            return task;
        }
        
        taskServiceMock.taskIsCancelled = function (task) {
            log("taskServiceMock:: taskIsCancelled => false");
            return false;
        }

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock
        });

        await start();

        expect(task.attempts).to.be.equals(1);
        expect(task.messageError).to.be.equals(errorMessage);
    });

    it('should cancel a 3 times failing task', async () => {

        const errorMessage = "FAILING ON PURPOSE";

        let task = {
            stateId: constants.STATE_PENDING,
            attempts: 2,
            taskData: {}
        };

        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }

        taskServiceMock.runTask = function (task) {
            log("taskServiceMock:: runTask => FAILED");
            return new Promise((resolve, reject) => {
                reject(errorMessage);
            });
        }

        taskServiceMock.updateFailingTask = function(task, error) {
            log("taskServiceMock:: updateFailingTask => ok");
            task.attempts = task.attempts + 1;
            task.messageError = error;
            task.stateId = constants.STATE_CANCELLED;
            return task;
        }

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock
        });

        await start();

        expect(task.attempts).to.be.equals(3);
        expect(task.stateId).to.be.equals(constants.STATE_CANCELLED);
    });

    it('should wait (do nothing) if a non overdue task is currently in progress', async () => {
        let taskInProgress = {
            stateId: constants.STATE_IN_PROGRESS,
            lastExecutionDate: new Date(),
            taskData: {}
        };

        taskServiceMock.getTaskInProgress = function () {
            log("taskServiceMock:: getTaskInProgress => taskInProgress");
            return taskInProgress;
        }

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
        });

        await start();

        expect(taskInProgress.stateId).to.be.equals(constants.STATE_IN_PROGRESS);
    });

    it('should cancel an overdue task', async () => {

        const translations = translationService.getTranslationsIn('en');

        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let taskInProgress = {
            stateId: constants.STATE_IN_PROGRESS,
            lastExecutionDate: yesterday,
            taskData: {}
        };

        taskServiceMock.getTaskInProgress = function () {
            log("taskServiceMock:: getTaskInProgress => taskInProgress");
            return taskInProgress;
        }

        taskServiceMock.cancelTask = function(task) {
            log("taskServiceMock:: updateFailingTask => ok");
            task.messageError = translations.taskService.cancelMessageError;
            task.stateId = constants.STATE_CANCELLED;
            return task;
        }

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
        });

        await start();

        expect(taskInProgress.messageError).to.be.equals(translations.taskService.cancelMessageError);
        expect(taskInProgress.stateId).to.be.equals(constants.STATE_CANCELLED);
    });
});