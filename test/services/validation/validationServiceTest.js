let chai = require("chai");
let assert = chai.assert;
let service = require('../../../services/validation/validationService.js');

function getSequence(fastaContent) {
    return  {
        name:"archivo.fasta",
        value:fastaContent
    };
}

describe('Validation service test ', () => {

    describe('Linker length calculation ', () => {

        it('Given  empty distance it should return false', () => {
            assert.isFalse(service.isValidDistance());
        });

        it('Given  invalid String distance it should return false', () => {
            assert.isFalse(service.isValidDistance('bad'));
        });

        it('Given a negative distance it should return false', () => {
            assert.isFalse(service.isValidDistance(-10));
        });

        it('Given a zero distance it should return false', () => {
            let zero = 0;
            assert.isFalse(service.isValidDistance(zero));
        });

        it('Given a zero distance with two decimals it should return false', () => {
            assert.isFalse(service.isValidDistance(5.06));
        });

        it('Given a positive distance it should return true', () => {
            assert.isTrue(service.isValidDistance(10));
        });

    });

    describe('Contact form validation ', () => {
        it('Given  empty email it should return false', () => {
            assert.isFalse(service.isValidContactData('', 'bot', 'hello'));
        });

        it('Given  empty email and name it should return false', () => {
            assert.isFalse(service.isValidContactData('', '', 'hello'));
        });

        it('Given empty all fields it should return false', () => {
            assert.isFalse(service.isValidContactData('', '', ''));
        });

        it('Given  empty message and mail, name valid  it should return false', () => {
            assert.isFalse(service.isValidContactData('', 'name', ''));
        });

        it('Given empty name and mail, message less than 50 caracters  it should return false', () => {
            assert.isFalse(service.isValidContactData('', '', 'hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given  mail, name with 15 caracteres and message less than 50 caracters  it should return false', () => {
            assert.isFalse(service.isValidContactData('', 'Nicolas Alberto', 'hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given  empty name it should return false', () => {
            assert.isFalse(service.isValidContactData('example@example.com', '', 'hello'));
        });

        it('Given  empty message it should return false', () => {
            assert.isFalse(service.isValidContactData('example@example.com', 'bot', ''));
        });

        it('Given   email without @ it should return false', () => {
            assert.isFalse(service.isValidContactData('exampleexample.com', 'bot', 'hello'));
        });

        it('Given   email with two @ it should return false', () => {
            assert.isFalse(service.isValidContactData('example@@example.com', 'bot', 'hello'));
        });

        it('Given   email without domain it should return false', () => {
            assert.isFalse(service.isValidContactData('example@', 'bot', 'hello'));
        });

        it('Given  email with space  it should return false', () => {
            assert.isFalse(service.isValidContactData('example@ example.com.ar', 'bot', 'hello'));
        });

        it('Given  email with final point  it should return false', () => {
            assert.isFalse(service.isValidContactData('example@example.com.', 'bot', 'hello'));
        });

        it('Given   message that exceed 50 caracters it should return true', () => {
            assert.isTrue(service.isValidContactData('nicolascoco@yahoo.com.ar', 'nicolas', 'hola como estas? quiero que ande el patena de una vez por todas. cuando puede estar listo...desde ya muchas gracias'));
        });

        it('Given   message that not exceed 50 caracters it should return false', () => {
            assert.isFalse(service.isValidContactData('example@example.com', 'bot', 'hello'));
        });
    });

    describe('Analize validation ', () => {

        it('Given  email and content correct it should return true', () => {
            assert.isTrue(service.isValidAnalyzeData("nicolascoco85@gmail.com", getSequence( "ACC")));
        });

        it('Given  email and content empty it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData("",getSequence( "")));
        });

        it('Given  email OK and content empty it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData("nicolascoco85@gmail.com", getSequence("")));
        });

        it('Given  email and content amino incorrect it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData("nicolascoco85@gmail.com", getSequence( "AXC")));
        });

        it('Given  email and content with space  it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData("nicolascoco85@gmail.com", getSequence("A B C")));
        });

        it('Given  email and content with double caracter initial it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData("",getSequence( ">>ABC")));
        });

        it('Given  email and content with double caracter initial it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData("nicolascoco85@gmail.com", getSequence( ">>ABC")));
        });
    });

    describe('Result validation', () => {

        it('Given order number format correct, it should return true', () => {
            assert.isTrue(service.isValidOrderNumber("02a79e96-ed72-445c-bf92-0cb324fea5db"));
        });

        it('Given order number contains spaces, it should return false', () => {
            assert.isFalse(service.isValidOrderNumber("02a79 e96-ed72-445c-bf92-0cb324 fea5db"));
        });

        it('Given order number with length less than allowed, it should return false', () => {
            assert.isFalse(service.isValidOrderNumber("02a79e96-ed72-445c-bf92-"));
        });

        it('Given order number no middle dash , it should return false', () => {
            assert.isFalse(service.isValidOrderNumber("02a79e96ed72445cbf920cb324fea5db"));
        });

        it('Given order number longer than allowed , it should return false', () => {
            assert.isFalse(service.isValidOrderNumber("02a79e96-ed72-445c-bf92-0cb324fea5db-258479"));
        });

        it('Given order number with special characters , it should return false', () => {
            assert.isFalse(service.isValidOrderNumber("02*79e96-ed72-445c-bf92-0cb324fe!5db"));
        });

        it('Given  empty order number , it should return false', () => {
            assert.isFalse(service.isValidOrderNumber(""));
        });
    });

    describe('Valid design validation', () => {
        it('should return false for no design information', () => {
            const result = service.isValidDesign();
            assert.isFalse(result);
        });
    });
});
