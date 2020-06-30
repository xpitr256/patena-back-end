const expect = require('chai').expect;
const proxyquire  =  require('proxyquire');

const DEBUG_MODE = false;
const genericErrorMessage = "FAILING ON PURPOSE";

function log(message) {
    if (DEBUG_MODE) {
        console.log(message);
    }
}

describe('Model Database', async () => {

    it('should connect with valid credentials', async () => {
        const moongoseMock = {
            connect: async function(user, pass) {
                log("moongoseMock:: connect => OK");
            }
        }

        const database = proxyquire('../../model/database', {
            'mongoose': moongoseMock,
        });

        const result = await database.connect();
        expect(result).to.be.equals(undefined);
    });

    it('should not connect with invalid credentials', async () => {
        const moongoseMock = {
            connect: async function(user, pass) {
                log("moongoseMock:: connect => FAILED");
                return new Promise((resolve, reject) => {
                    reject(genericErrorMessage);
                });
            }
        }

        const database = proxyquire('../../model/database', {
            'mongoose': moongoseMock,
        });

        const result = await database.connect();
        expect(result).to.be.equals(undefined);
    });

})