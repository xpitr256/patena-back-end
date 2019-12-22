const expect = require('chai').expect;
let service = require('../../services/linkerLengthService');
let chai = require("chai");
let assert = chai.assert;
let connectionBBDD = require('../../model/baseDeDatos');


describe('Consult Length', function () {
    connectionBBDD.conectarDB();
    describe('Consulting BBDD Distance-Length', function () {

        it('Ask for the number 1.3 and I hope you return an answer ', async () => {
            const result = await service.getLength(1.3);
            expect(result).to.be.an('Number');
        });

        it('Ask for the number 1 and I hope you return the value 1.0', async () => {
            const result = await service.getLength(1);
            expect(result).to.equal(1.0);
        });


        it('Ask for the number 8.6 and I hope you return the value 3', async () => {
            const result = await service.getLength(8.6);
            expect(result).to.equal(3);
        });

        it('Ask for the number 6.5 and I hope you return the value positive', async () => {
            const result = await service.getLength(6.5);
            assert.isBelow(0,result);
        });


    });
});
