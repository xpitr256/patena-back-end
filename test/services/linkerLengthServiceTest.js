let chai = require("chai");
let expect = chai.expect;
let assert = chai.assert;
let service = require('../../services/linkerLengthService');




describe('Generate Length service test ', () => {

    describe('Linker length calculation ', () => {

        it('Given  empty distance it should return false', () => {

            assert.isFalse( service.getLength(1.0) < 0);
        });

        it('Debe devolver el valor pasado como parámetro', async function () {
            var result = await service.getLength(1.0);
            expect(result).to.be.equal(1);
        });

    });

});