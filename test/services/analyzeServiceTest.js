const expect = require('chai').expect;
const proxyquire  =  require('proxyquire');
const constants = require('./../../services/constants');

describe('Analyze Service', () => {
    it('should create an Analyze Task and return generated id', async () => {
        const taskServiceMock = {
            create: async function(id, taskData, typeId) {}
        }
        const designService = proxyquire('../../services/analyzeService', {
            './taskService': taskServiceMock
        });
        const id = await designService.createAnalysis(undefined, 'ACC');
        expect(id).not.to.be.undefined;
        expect(id).to.be.lengthOf(36);
    });

    it('should create an Analyze Task and notify user mail', async () => {
        const taskServiceMock = {
            create: async function(id, taskData, typeId) {
                expect(taskData.sequence).to.be.equals('ACC');
                expect(typeId).to.be.equals(constants.TYPE_ANALYSIS);
            }
        }
        const mailServiceMock = {
            sendWorkInProgressMail : function(email, language, workType, workId) {
                expect(email).to.be.equals('test@test.com');
                expect(language).to.be.equals('en');
                expect(workType).to.be.equals(constants.TYPE_ANALYSIS);
            }
        }
        const designService = proxyquire('../../services/analyzeService', {
            './taskService': taskServiceMock,
            './mail/mailService': mailServiceMock
        });
        const id = await designService.createAnalysis('test@test.com', 'ACC');
        expect(id).not.to.be.undefined;
        expect(id).to.be.lengthOf(36);
    });

    it('should fail if it is not possible to create a new design Task ', async () => {
        const taskServiceMock = {
            create: async function (id, taskData, typeId) {
                return new Promise((resolve,reject) => {
                    reject("Failed on purpose");
                });
            }
        }
        const designService = proxyquire('../../services/analyzeService', {
            './taskService': taskServiceMock
        });

        const result = await designService.createAnalysis(undefined, 'ACC');
        expect(result).to.be.an('Error');
    });
});