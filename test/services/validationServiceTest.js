let chai = require("chai");
let assert = chai.assert;

let service = require('../../services/validationService.js');

describe('Validation service test ', () => {

    describe('Linker length calculation ', () => {

      it('Given an empty distance it should return false', () => {
        assert.isFalse(service.isValidDistance());
      });

      it('Given an invalid String distance it should return false', () => {
        assert.isFalse(service.isValidDistance('bad'));
      });

      it('Given a negative distance it should return false', () => {
        assert.isFalse(service.isValidDistance(-10));
      });

      it('Given a zero distance it should return false', () => {
          let zero=0;
        assert.isFalse(service.isValidDistance(zero));
      });

      it('Given a zero distance as string it should return false', () => {
        assert.isFalse(service.isValidDistance('0'));
      });

      it('Given a positive distance it should return true', () => {
        assert.isTrue(service.isValidDistance(10));
      });

    });

    describe('Contact form validation ', () => {

        it('Given an empty email it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('','bot','hello'));
        });

        it('Given  empty email and name it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('','','hello'));
        });

        it('Given empty all fields it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('','',''));
        });

        it('Given  empty message and mail, name valid  it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('','name',''));
        });

        it('Given empty name and mail, message less than 50 caracters  it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('','','hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given an mail, name with 15 caracteres and message less than 50 caracters  it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('','Nicolas Alberto','hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given an empty name it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('example@example.com','','hello'));
        });

        it('Given an empty message it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('example@example.com','bot',''));
        });

        it('Given an  email without @ it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('exampleexample.com','bot','hello'));
        });

        it('Given an  email with two @ it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('example@@example.com','bot','hello'));
        });

        it('Given an  email without domain it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('example@','bot','hello'));
        });

        it('Given an email with space  it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('example@ example.com.ar','bot','hello'));
        });

        it('Given an email with final point  it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('example@example.com.','bot','hello'));
        });

        it('Given an  message that exceed 50 caracters it should return true', () => {
            assert.isTrue(service.  isValidDataContact ('nicolascoco@yahoo.com.ar','nicolas','hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given an  message that not exceed 50 caracters it should return false', () => {
            assert.isFalse(service.  isValidDataContact ('example@example.com','bot','hello'));
        });

    });


});
