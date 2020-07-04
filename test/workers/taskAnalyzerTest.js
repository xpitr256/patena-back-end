const expect = require('chai').expect;
const proxyquire  =  require('proxyquire');
const constants = require ('../../services/constants');
const translationService = require ('../../services/translationService');

const DEBUG_MODE = false;
const genericErrorMessage = "FAILING ON PURPOSE";

function log(message) {
    if (DEBUG_MODE) {
        console.log(message);
    }
}

//TASK SERVICE MOCK FUNCTIONS
function failingUpdateSentEmailNotification (task) {
    log("taskServiceMock:: updateSentEmailNotification => FAILED");
    return new Promise((resolve, reject) => {
        reject(genericErrorMessage);
    });
}

function updateSentEmailNotification (task) {
    log("taskServiceMock:: updateSentEmailNotification => updated task");
    task.emailSent = true;
    task.sentEmailDate = new Date();
    return task;
}

function getNoTaskInProgress (task) {
    log("taskServiceMock:: getTaskInProgress => undefined");
}

function getNoNextPendingTask (task) {
    log("taskServiceMock:: getNextPendingTask => undefined");
}

function runNoTask (task) {
    log("taskServiceMock:: runTask => nothing");
}

function runFailingTask (task) {
    log("taskServiceMock:: runTask => FAILED");
    return new Promise((resolve, reject) => {
        reject(genericErrorMessage);
    });
}

function promoteTaskToInProgress (task) {
    log("taskServiceMock:: promoteTaskToInProgress => updated task");
    task.stateId = constants.TASK_STATE_IN_PROGRESS;
    return task;
}

function updateFailingTask(task, error) {
    log("taskServiceMock:: updateFailingTask => ok");
    task.attempts = task.attempts + 1;
    task.messageError = error;
    return task;
}

function updateFailingTaskCancellingTask(task, error) {
    log("taskServiceMock:: updateFailingTaskCancellingTask => ok");
    task.attempts = task.attempts + 1;
    task.messageError = error;
    task.stateId = constants.TASK_STATE_CANCELLED;
    return task;
}

function taskIsCancelledReturnFalse(task) {
    log("taskServiceMock:: taskIsCancelled => false");
    return false;
}

//EMAIL SERVICE MOCK FUNCTIONS
function sendWorkSuccessMail(email, language, workType, workId) {
    log("emailServiceMock:: sendWorkSuccessMail => sent OK");
}

function sendWorkErrorMail(email, language, workType, workId) {
    log("emailServiceMock:: sendWorkErrorMail => sent OK");
}

function failSendingEmail(task) {
    log("emailServiceMock:: sendWorkSuccessMail | sendWorkErrorMail => FAILED");
    return new Promise((resolve, reject) => {
        reject(genericErrorMessage);
    });
}

const databaseMock = {
    connect: () => {
        log("databaseMock:: connected OK!");
    }
};

describe('Task analyzer worker',() => {

    it('should do nothing when no task is pending ', async () => {

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = getNoNextPendingTask;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
        });

        const result = await start();
        expect(result).to.be.equals(undefined);
    });

    it('should promote task to "in progress" for pending task', async () => {

        let task = {
            stateId: constants.TASK_STATE_PENDING,
            taskData: {}
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runNoTask;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock
        });

        await start();

        expect(task.stateId).to.be.equals(constants.TASK_STATE_IN_PROGRESS);
    });

    it('should mark email sent and sent email date for a successful task run with email', async () => {

        let task = {
            stateId: constants.TASK_STATE_PENDING,
            emailSent: false,
            taskData: {
                email: "test_email@test.com"
            }
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runNoTask;
        taskServiceMock.updateSentEmailNotification = updateSentEmailNotification;

        let emailServiceMock = {};
        emailServiceMock.sendWorkSuccessMail = sendWorkSuccessMail;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
            './../services/mail/mailService': emailServiceMock
        });

        await start();

        expect(task.emailSent).to.be.true;
        expect(task.sentEmailDate).to.be.an('Date');
    });

    it('should not mark email sent if sendWorkSuccessMail fails for a successful task', async () => {

        let task = {
            id: 12345,
            stateId: constants.TASK_STATE_PENDING,
            emailSent: false,
            taskData: {
                email: "test_email@test.com"
            }
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runNoTask;
        taskServiceMock.updateSentEmailNotification = updateSentEmailNotification;

        let emailServiceMock = {};
        emailServiceMock.sendWorkSuccessMail = failSendingEmail;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
            './../services/mail/mailService': emailServiceMock
        });

        await start();

        expect(task.emailSent).to.be.false;
        expect(task.sentEmailDate).to.be.an('undefined');
    });

    it('should not mark email sent if updateSentEmailNotification fails for a successful task', async () => {

        let task = {
            id: 12345,
            stateId: constants.TASK_STATE_PENDING,
            emailSent: false,
            taskData: {
                email: "test_email@test.com"
            }
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runNoTask;
        taskServiceMock.updateSentEmailNotification = failingUpdateSentEmailNotification;

        let emailServiceMock = {};
        emailServiceMock.sendWorkSuccessMail = sendWorkSuccessMail;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
            './../services/mail/mailService': emailServiceMock
        });

        await start();

        expect(task.emailSent).to.be.false;
        expect(task.sentEmailDate).to.be.an('undefined');
    });

    it('should update a failing task by increasing its attempts and saving error message', async () => {

        let task = {
            stateId: constants.TASK_STATE_PENDING,
            attempts: 0,
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runFailingTask;
        taskServiceMock.updateFailingTask = updateFailingTask;
        taskServiceMock.taskIsCancelled = taskIsCancelledReturnFalse;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock
        });

        await start();

        expect(task.attempts).to.be.equals(1);
        expect(task.messageError).to.be.equals(genericErrorMessage);
    });

    it('should cancel a 3 times failing task', async () => {

        let task = {
            stateId: constants.TASK_STATE_PENDING,
            attempts: 2,
            taskData: {}
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runFailingTask;
        taskServiceMock.updateFailingTask = updateFailingTaskCancellingTask;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock
        });

        await start();

        expect(task.attempts).to.be.equals(3);
        expect(task.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
    });

    it('should notify a user that task is canceled', async () => {

        let task = {
            id: 12345,
            stateId: constants.TASK_STATE_PENDING,
            emailSent: false,
            attempts: 2,
            taskData: {
                email: "test_email@test.com"
            }
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runFailingTask;
        taskServiceMock.updateFailingTask = updateFailingTaskCancellingTask;
        taskServiceMock.updateSentEmailNotification = updateSentEmailNotification;

        let emailServiceMock = {};
        emailServiceMock.sendWorkErrorMail = sendWorkErrorMail;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
            './../services/mail/mailService': emailServiceMock
        });

        task = await start();

        expect(task.attempts).to.be.equals(3);
        expect(task.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
        expect(task.emailSent).to.be.true;
        expect(task.sentEmailDate).to.be.an('Date');
    });

    it('should not notify a user that task is canceled if updateSentEmailNotification fails', async () => {

        let task = {
            id: 12345,
            stateId: constants.TASK_STATE_PENDING,
            emailSent: false,
            attempts: 2,
            taskData: {
                email: "test_email@test.com"
            }
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runFailingTask;
        taskServiceMock.updateFailingTask = updateFailingTaskCancellingTask;
        taskServiceMock.updateSentEmailNotification = failingUpdateSentEmailNotification;

        let emailServiceMock = {};
        emailServiceMock.sendWorkErrorMail = sendWorkErrorMail;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
            './../services/mail/mailService': emailServiceMock
        });

        await start();

        expect(task.attempts).to.be.equals(3);
        expect(task.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
        expect(task.emailSent).to.be.false;
        expect(task.sentEmailDate).to.be.an('undefined');
    });


    it('should not notify a user that task is canceled  if sendWorkErrorMail fails', async () => {

        let task = {
            id: 12345,
            stateId: constants.TASK_STATE_PENDING,
            emailSent: false,
            attempts: 2,
            taskData: {
                email: "test_email@test.com"
            }
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = getNoTaskInProgress;
        taskServiceMock.getNextPendingTask = function () {
            log("taskServiceMock:: getNextPendingTask => task");
            return task;
        }
        taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
        taskServiceMock.runTask = runFailingTask;
        taskServiceMock.updateFailingTask = updateFailingTaskCancellingTask;
        taskServiceMock.updateSentEmailNotification = updateSentEmailNotification;

        let emailServiceMock = {};
        emailServiceMock.sendWorkErrorMail = failSendingEmail;

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
            './../services/mail/mailService': emailServiceMock
        });

        task = await start();

        expect(task.attempts).to.be.equals(3);
        expect(task.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
        expect(task.emailSent).to.be.false;
        expect(task.sentEmailDate).to.be.an('undefined');
    });






    it('should wait (do nothing) if a non overdue task is currently in progress', async () => {
        let taskInProgress = {
            stateId: constants.TASK_STATE_IN_PROGRESS,
            lastExecutionDate: new Date(),
            taskData: {}
        };

        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = function () {
            log("taskServiceMock:: getTaskInProgress => taskInProgress");
            return taskInProgress;
        }

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
        });

        await start();

        expect(taskInProgress.stateId).to.be.equals(constants.TASK_STATE_IN_PROGRESS);
    });

    it('should cancel an overdue task', async () => {

        const translations = translationService.getTranslationsIn('en');

        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let taskInProgress = {
            stateId: constants.TASK_STATE_IN_PROGRESS,
            lastExecutionDate: yesterday,
            taskData: {}
        };
        let taskServiceMock = {};
        taskServiceMock.getTaskInProgress = function () {
            log("taskServiceMock:: getTaskInProgress => taskInProgress");
            return taskInProgress;
        }

        taskServiceMock.cancelTask = function(task) {
            log("taskServiceMock:: updateFailingTask => ok");
            task.messageError = translations.taskService.cancelMessageError;
            task.stateId = constants.TASK_STATE_CANCELLED;
            return task;
        }

        const start = proxyquire('../../workers/taskAnalyzer', {
            './../model/database': databaseMock,
            './../services/taskService': taskServiceMock,
        });

        await start();

        expect(taskInProgress.messageError).to.be.equals(translations.taskService.cancelMessageError);
        expect(taskInProgress.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
    });
});