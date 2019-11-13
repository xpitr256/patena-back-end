let chai = require("chai");
let assert = chai.assert;
let service = require('../../services/validationService.js');

function getFile(nameWithextension, size){
    let file = new Object();
    file.name=nameWithextension;
    file.size=size;
    return file;
}



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
            assert.isFalse(service.  isValidContactData ('','bot','hello'));
        });

        it('Given  empty email and name it should return false', () => {
            assert.isFalse(service.  isValidContactData ('','','hello'));
        });

        it('Given empty all fields it should return false', () => {
            assert.isFalse(service.  isValidContactData ('','',''));
        });

        it('Given  empty message and mail, name valid  it should return false', () => {
            assert.isFalse(service.  isValidContactData ('','name',''));
        });

        it('Given empty name and mail, message less than 50 caracters  it should return false', () => {
            assert.isFalse(service.  isValidContactData ('','','hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given an mail, name with 15 caracteres and message less than 50 caracters  it should return false', () => {
            assert.isFalse(service.  isValidContactData ('','Nicolas Alberto','hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given an empty name it should return false', () => {
            assert.isFalse(service.  isValidContactData ('example@example.com','','hello'));
        });

        it('Given an empty message it should return false', () => {
            assert.isFalse(service.  isValidContactData ('example@example.com','bot',''));
        });

        it('Given an  email without @ it should return false', () => {
            assert.isFalse(service.  isValidContactData ('exampleexample.com','bot','hello'));
        });

        it('Given an  email with two @ it should return false', () => {
            assert.isFalse(service.  isValidContactData ('example@@example.com','bot','hello'));
        });

        it('Given an  email without domain it should return false', () => {
            assert.isFalse(service.  isValidContactData ('example@','bot','hello'));
        });

        it('Given an email with space  it should return false', () => {
            assert.isFalse(service.  isValidContactData ('example@ example.com.ar','bot','hello'));
        });

        it('Given an email with final point  it should return false', () => {
            assert.isFalse(service.  isValidContactData ('example@example.com.','bot','hello'));
        });

        it('Given an  message that exceed 50 caracters it should return true', () => {
            assert.isTrue(service.  isValidContactData ('nicolascoco@yahoo.com.ar','nicolas','hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given an  message that not exceed 50 caracters it should return false', () => {
            assert.isFalse(service.  isValidContactData ('example@example.com','bot','hello'));
        });

    });

    describe('Results order number form validation ', () => {

        it('Given an order number correct it should return true', () => {
            assert.isTrue(service. isValidOrderNumber ("2b0220d3-aec5-4fc3-8560-670fc6f0be68"));
        });

        it('Given an order number with 35 characters it should return false', () => {
            assert.isFalse(service. isValidOrderNumber ("2b0220d3-aec5-4fc3-8560-670fc6f0be6"));
        });

        it('Given an order number with characters no hexadecimal it should return false', () => {
            assert.isFalse(service. isValidOrderNumber ("2b0220z3-aec5-4fc3-8560-670fc6f0be6"));
        });

        it('Given an order number empty it should return false', () => {
            assert.isFalse(service. isValidOrderNumber (""));
        });

        it('Given an order number with spaces it should return false', () => {
            assert.isFalse(service. isValidOrderNumber ("2b0220d -ae 5-4fc3-8560-670fc6f0be6"));
        });




    });

    describe('Analize validation ', () => {

        it('Given an email and an file name .fasta correct it should return true', () => {
            assert.isTrue(service. isValidForAnalize ("nicolascoco85@gmail.com", getFile('archivo.fasta',255)));
        });

        it('Given an email and an file name .txt correct it should return true', () => {
            assert.isTrue(service. isValidForAnalize ("nicolascoco85@gmail.com",getFile('archivo.txt',255)));
        });

        it('Given an email and an file name empty it should return false', () => {
            assert.isFalse(service. isValidForAnalize ("",getFile("",255)));
        });

        it('Given an email OK and an file name empty it should return false', () => {
            assert.isFalse(service. isValidForAnalize ("nicolascoco85@gmail.com",""));
        });

        it('Given an email and an file name .fast correct it should return false', () => {
            assert.isFalse(service. isValidForAnalize ("nicolascoco85@gmail.com","archivo.fast"));
        });

        it('Given an email and an file name .fastaa correct it should return false', () => {
            assert.isFalse(service. isValidForAnalize ("nicolascoco85@gmail.com","archivo.fastaa"));
        });

        it('Given an email and an file name .fasta it should return false', () => {
            assert.isFalse(service. isValidForAnalize ("","archivo.fasta"));
        });

        it('Given an email empty and an file name empty it should return false', () => {
            assert.isFalse(service. isValidForAnalize ("nicolascoco85@gmail.com",""));
        });
    });
});
