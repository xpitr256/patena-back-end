const expect = require('chai').expect;
let service = require('../../services/linkerLengthService');
let chai = require("chai");
let assert = chai.assert;

describe('Linker Length service', function () {

    describe('Getting linker length from distance', function () {

        it('Ask for the number 1.3 and I hope you return an answer ', async () => {
            const result = await service.getLength(1.3);
            expect(result).to.be.an('Number');
        });

        it('Ask for the number 80 and I hope you return an answer ', async () => {
            const result = await service.getLength(80);
            expect(result).to.be.an('Number');
        });

        it('Ask for the number 1 and I hope you return the value 1.0', async () => {
            const result = await service.getLength(1);
            expect(result).to.equal(2.0);
        });

        it('Ask for the number 8.6 and I hope you return the value 3', async () => {
            const result = await service.getLength(8.6);
            expect(result).to.equal(3);
        });

        it('Ask for the number 6.5 and I hope you return the value positive', async () => {
            const result = await service.getLength(6.5);
            assert.isBelow(0,result);
        });

        it('should return zero for non distance at all', () => {
            const result = service.getLength();
            expect(result).to.be.equal(0);
        });

        it('should return zero for negative distance', () => {
            const result = service.getLength(-2);
            expect(result).to.be.equal(0);
        });

        it('should return zero for a text as distance', () => {
            const result = service.getLength('text');
            expect(result).to.be.equal(0);
        });

        it('should return zero for a null as distance', () => {
            const result = service.getLength(null);
            expect(result).to.be.equal(0);
        });
    });
});
