let chai = require("chai");
let assert = chai.assert;
let service = require('../../services/validationService.js');

const SumOfFrequenciesToEquals10000= [
    { name: "A", value: 0.825 },
    { name: "R", value: 0.553 },
    { name: "N", value: 0.406 },
    { name: "D", value: 0.545 },
    { name: "C", value: 0.137 },
    { name: "E", value: 0.393 },
    { name: "Q", value: 0.675 },
    { name: "G", value: 0.707 },
    { name: "H", value: 0.227 },
    { name: "I", value: 0.596 },
    { name: "L", value: 0.966 },
    { name: "K", value: 0.548},
    { name: "M", value: 0.242 },
    { name: "F", value: 0.386, uvSilent: true },
    { name: "P", value: 0.47 },
    { name: "S", value: 0.656 },
    { name: "T", value: 0.534 },
    { name: "W", value: 0.108, uvSilent: true },
    { name: "Y", value: 0.292, uvSilent: true },
    { name: "V", value: 0.734 }
];
const SumOfFrequenciesLessThan10000= [
    { name: "A", value: 0.725 },
    { name: "R", value: 0.553 },
    { name: "N", value: 0.406 },
    { name: "D", value: 0.545 },
    { name: "C", value: 0.137 },
    { name: "E", value: 0.393 },
    { name: "Q", value: 0.675 },
    { name: "G", value: 0.707 },
    { name: "H", value: 0.227 },
    { name: "I", value: 0.596 },
    { name: "L", value: 0.966 },
    { name: "K", value: 0.548},
    { name: "M", value: 0.242 },
    { name: "F", value: 0.386, uvSilent: true },
    { name: "P", value: 0.47 },
    { name: "S", value: 0.656 },
    { name: "T", value: 0.534 },
    { name: "W", value: 0.108, uvSilent: true },
    { name: "Y", value: 0.292, uvSilent: true },
    { name: "V", value: 0.734 }
];
const SumOfFrequenciesGreaterThan10000= [
    { name: "A", value: 0.925 },
    { name: "R", value: 0.553 },
    { name: "N", value: 0.406 },
    { name: "D", value: 0.545 },
    { name: "C", value: 0.137 },
    { name: "E", value: 0.393 },
    { name: "Q", value: 0.675 },
    { name: "G", value: 0.707 },
    { name: "H", value: 0.227 },
    { name: "I", value: 0.596 },
    { name: "L", value: 0.966 },
    { name: "K", value: 0.548},
    { name: "M", value: 0.242 },
    { name: "F", value: 0.386, uvSilent: true },
    { name: "P", value: 0.47 },
    { name: "S", value: 0.656 },
    { name: "T", value: 0.534 },
    { name: "W", value: 0.108, uvSilent: true },
    { name: "Y", value: 0.292, uvSilent: true },
    { name: "V", value: 0.734 }
];
const algorithmsAnyActived= [
    { name: "BLAST", active: false },
    { name: "TANGO", active: false },
    { name: "ELM", active: false },
    { name: "IUPred", active: false },
    { name: "ANCHOR", active: false },
    { name: "Prosite", active: false },
    { name: "Limbo", active: false },
    { name: "TMHMM", active: false },
    { name: "PASTA", active: false },
    { name: "Waltz", active: true },
    { name: "Amyloid pattern", active: false }
];
const algorithmsAllActived= [
    { name: "BLAST", active: true },
    { name: "TANGO", active: true },
    { name: "ELM", active: true },
    { name: "IUPred", active: true },
    { name: "ANCHOR", active: true },
    { name: "Prosite", active: true },
    { name: "Limbo", active: true },
    { name: "TMHMM", active: true },
    { name: "PASTA", active: true },
    { name: "Waltz", active: true },
    { name: "Amyloid pattern", active: true }
];
const algorithmsAllDesactived= [
    { name: "BLAST", active: false },
    { name: "TANGO", active: false },
    { name: "ELM", active: false },
    { name: "IUPred", active: false },
    { name: "ANCHOR", active: false },
    { name: "Prosite", active: false },
    { name: "Limbo", active: false },
    { name: "TMHMM", active: false },
    { name: "PASTA", active: false },
    { name: "Waltz", active: false },
    { name: "Amyloid pattern", active: false }
];

function getBodyAnalize(email, fastaContent){
    let body = new Object();
    body.email=email;
    body.sequence= { name:"archivo.fasta",value:fastaContent};

    return body;
}

function getBody(designType,email,flankingSequence1,flankingSequence2, initialSequence, distance ){
    let body = new Object();
    body.designType=designType;
    body.email=email;
    body.flankingSequence1= { name:"archivo.fasta",value:flankingSequence1};
    body.flankingSequence2= { name:"archivo.fasta",value:flankingSequence2};
    body.initialSequence= { name:"archivo.fasta",value:initialSequence};
    body.distance=distance;
    return body;
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

        it('Given a zero distance as string it should return false', () => {
            assert.isFalse(service.isValidDistance('0'));
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
            assert.isTrue(service.isValidAnalyzeData(getBodyAnalize("nicolascoco85@gmail.com", "ABC")));
        });

        it('Given  email and content correct it should return true', () => {
            assert.isTrue(service.isValidAnalyzeData(getBodyAnalize("nicolascoco85@gmail.com", "ABC")));
        });

        it('Given  email and content empty it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData(getBody("", "")));
        });

        it('Given  email OK and content empty it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData(getBody("nicolascoco85@gmail.com", "")));
        });

        it('Given  email and content amino incorrect it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData(getBody("nicolascoco85@gmail.com", "AXC")));
        });

        it('Given  email and content with space  it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData(getBody("nicolascoco85@gmail.com", "A B C")));
        });

        it('Given  email and content with double caracter initial it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData(getBody("", ">>ABC")));
        });

        it('Given  email and content with double caracter initial it should return false', () => {
            assert.isFalse(service.isValidAnalyzeData(getBody("nicolascoco85@gmail.com", ">>ABC")));
        });
    });

    describe('Design 1 validation ', () => {
        //Data required: distance, email, set configurations patena
        it('Given  email correct and distance equals 40 it should return true', () => {
            //Data required: distance, email, set configurations patena
            assert.isTrue(service.isValidDesignData(getBody(1, "ncoco@cys.com.ar", "", "", "", 40)));
        });

        it('Given empty field email and distance equals 40 it should return false', () => {
            //Data required: distance, email, set configurations patena
            assert.isFalse(service.isValidDesignData(getBody(1, "", "", "", "", 40)));
        });

        it('Given  email incorrect and distance equals 40 it should return false', () => {
            //Data required: distance, email, set configurations patena
            assert.isFalse(service.isValidDesignData(getBody(1, "ncoccys.com.ar", "", "", "", 40)));
        });

        it('Given  email incorrect and negative distance it should return false', () => {
            //Data required: distance, email, set configurations patena
            assert.isFalse(service.isValidDesignData(getBody(1, "ncoccys.com.ar", "", "", "", -40)));
        });

        it('Given  email incorrect and zero distance it should return false', () => {
            //Data required: distance, email, set configurations Patena(frequency,  charge, algorithms)
            assert.isFalse(service.isValidDesignData(getBody(1, "ncoccys.com.ar", "", "", "", 0)));
        });

        it('Given  email incorrect and empty field distance it should return false', () => {
            //Data required: distance, email, set configurations patena
            assert.isFalse(service.isValidDesignData(getBody(1, "ncoccys.com.ar", "", "", "",)));
        });

        it('Given  email correct and decimal data for field distance it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(1, "ncoco@cys.com.ar", "", "", "", 40.5)));
        });

        it('Given  email incorrect and decimal data for field distance it should return false', () => {
            //Data required: distance, email, set configurations patena
            assert.isFalse(service.isValidDesignData(getBody(1, "@cys.com.ar", "", "", "", 40.5)));
        });

    });

    describe('Design 2 validation ', () => {
        //Data required: initial sequential, email, set configurations patena
        it('Given  email correct and inicial sequential correct it should return true', () => {

            assert.isTrue(service.isValidDesignData(getBody(2, "ncoco@cys.com.ar", "", "", "MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEGLVSVKVSDDF\n" +
                "TIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHKIPQFASRKQLSDAILKEAEE\n" +
                "KIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTLMGQFYVMDDKKTVEQVIAEKEKEFGGKIKI\n" +
                "VEFICFEVGEGLEKKTEDFAAEVAAQL",)));
        });

        it('Given empty field email and empty inicial sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "", "", "", "",)));
        });

        it('Given  email incorrect and empty inicial sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "ncoccys.com.ar", "", "", "",)));
        });

        it('Given  email incorrect and inicial sequential with caracter incorrect it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "ncoccys.com.ar", "", "", "XABC",)));
        });

        it('Given empty field email and inicial sequential with caracter  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "", "", "", "XABC",)));
        });


        it('Given  email correct  and empty inicial sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "ncoco@cys.com.ar", "", "", "",)));
        });

        it('Given  email correct  and inicial sequential with caracter incorrect it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "ncoco@cys.com.ar", "", "", "XABC",)));
        });

        it('Given empty field email and empty inicial sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "", "", "", "",)));
        });

        it('Given  email incorrect and empty inicial sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "ncoccys.com.ar", "", "", "",)));
        });

        it('Given  email incorrect and inicial sequential valid it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "ncoccys.com.ar", "", "", "ABC",)));
        });

        it('Given empty field email and inicial sequential valid  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(2, "", "", "", "ABC",)));
        });


    });

    describe('Design 3 validation ', () => {
        //Data required: flankingSequence1, flankingSequence2, distance, email, set configurations patena
        it('Given  email correct, positive distance and flanking sequential corrects it should return true', () => {

            assert.isTrue(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "ABC", "ABC", "", 30)));
        });

        it('Given empty field email, negative distance ,empty flanking sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "", "", "", "", -30)));
        });

        it('Given empty field email, empty distance ,empty flanking sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "", "", "", "",)));
        });

        it('Given  email incorrect, empty distance and empty flanking sequential it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoccys.com.ar", "", "", "",)));
        });

        it('Given  email incorrect,negative distance and empty flanking sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoccys.com.ar", "", "", "", -30)));
        });

        it('Given  email incorrect, empty distance and flanking sequential with caracter incorrect it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoccys.com.ar", "AXBC", "AXBC", "",)));
        });

        it('Given  email incorrect, negative distance and flanking sequential with caracter incorrect it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoccys.com.ar", "AXBC", "AXBC", "", -25)));
        });

        it('Given  email incorrect, positive distance and flanking sequential with caracter incorrect it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoccys.com.ar", "AXBC", "AXBC", "", 25)));
        });

        it('Given empty field email and inicial sequential with caracter  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "", "", "", "",)));
        });

        it('Given  email correct,positive distance and empty flanking sequential2  and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "ABC", "", "", 40)));
        });

        it('Given  email correct,positive distance and empty flanking sequential1  and flanking sequential2 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "", "ABC", "", 40)));
        });

        it('Given  email correct,negative distance and empty flanking sequential2  and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "ABC", "", "", -40)));
        });

        it('Given  email correct,negative distance and empty flanking sequential1  and flanking sequential2 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "", "ABC", "", -40)));
        });

        it('Given  email correct ,positive distance , flanking sequential2 wrong and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "ABC", "XACB", "", 40)));
        });

        it('Given  email correct , positive distance , flanking sequential1 wrong and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "XABC", "ACB", "", 40)));
        });

        it('Given  email correct ,  negative distance, flanking sequential2 wrong and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "ABC", "XACB", "", -40)));
        });

        it('Given  email correct , negative distance, flanking sequential1 wrong and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoco@cys.com.ar", "XABC", "ACB", "", -40)));
        });

        it('Given empty field email and flanking sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "", "", "", "", 40)));
        });

        it('Given  email incorrect , flanking sequential and distance valid   it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "ncoccys.com.ar", "ABC", "ABC", "", 40)));
        });

        it('Given empty field email, flanking sequential and distance valid  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(3, "", "ABC", "ABC", "", 40)));
        });


    });

    describe('Design 4 validation ', () => {
        //Data required: flankingSequence1, flankingSequence2, initial sequential, distance, email, set configurations patena
        it('Given  email correct, positive distance, initial sequential and flanking sequential corrects it should return true', () => {

            assert.isTrue(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "ABC", "ABC", "ABC", 30)));
        });

        it('Given empty field email, negative distance ,empty the rest of the parameters required  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "", "", "", "", -30)));
        });

        it('Given empty field email, positive distance ,empty the rest of the parameters required  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "", "", "", "", 30)));
        });

        it('Given empty field email, empty distance ,the rest of the parameters required completed  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "", "ABC", "ABC", "ACB", "")));
        });

        it('Given empty field email, negative distance ,the rest of the parameters required completed  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "", "ABC", "ABC", "ACB", "-40")));
        });

        it('Given email, negative distance ,empty the rest of the parameters required  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "", "", "", -30)));
        });

        it('Given  email, positive distance ,empty the rest of the parameters required  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "", "", "", 30)));
        });

        it('Given  email, empty distance ,the rest of the parameters required completed  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "ABC", "ABC", "ABC",)));
        });

        it('Given  email, negative distance ,the rest of the parameters required completed  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "ABC", "ABC", "ABC", -40)));
        });

        it('Given  email incorrect, empty the rest of the parameters required it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "", "", "", "")));
        });

        it('Given  email incorrect, empty the rest of the parameters required completed  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "ABC", "ABC", "45")));
        });

        it('Give email incorrect, negative distance, empty the rest of the parameters required completed  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "ABC", "ABC", "-45")));
        });

        it('Given email incorrect,negative distance and empty flanking sequential  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "", "", "", -30)));
        });

        it('Given email incorrect,negative distance, empty initial sequential and  the rest of the parameters completed it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "ABC", "", 30)));
        });

        it('Given email incorrect,positive distance, empty initial sequential and the rest of the parameters completed it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "ABC", "", 30)));
        });

        it('Given  email incorrect, empty initial sequential and the rest of the parameters requeried completed it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "ABC", "", 30)));
        });

        it('Given email incorrect, empty distance, flanking sequential with caracter incorrect and initial sequential correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "AXBC", "AXBC", "ABF",)));
        });

        it('Given email incorrect, empty distance, flanking sequential 1 with caracter incorrect and the rest parameters correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "AXBC", "ABC", "ABF",)));
        });

        it('Given email incorrect, empty distance, flanking sequential 2 with caracter incorrect and the rest parameters correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "AXBC", "ABC", "ABF",)));
        });

        it('Given email incorrect, negative distance and flanking sequential with caracter incorrect and the rest parameters correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "AXBC", "ABC", -25)));
        });

        it('Given email incorrect, positive distance and flanking sequential1 with caracter incorrect and the rest parameters correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "AXBC", "ABC", 25)));
        });

        it('Given email incorrect, positive distance and flanking sequential1 with caracter incorrect and the rest parameters correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "AXBC", "AXBC", "", 25)));
        });

        it('Given email incorrect, positive distance, initial sequential with caracter incorrect and the rest parameters correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "ABC", "AXBC", 25)));
        });

        it('Given empty field email and inicial sequential with caracter  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "", "", "", "",)));
        });

        it('Given email correct,positive distance and empty flanking sequential2  and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "ABC", "", "", 40)));
        });

        it('Given email correct,positive distance and empty flanking sequential1  and flanking sequential2 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "", "ABC", "", 40)));
        });

        it('Given email correct,negative distance and empty flanking sequential2  and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "ABC", "", "", -40)));
        });

        it('Given email correct,negative distance and empty flanking sequential1  and flanking sequential2 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "", "ABC", "", -40)));
        });

        it('Given email correct ,positive distance , flanking sequential2 wrong and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "ABC", "XACB", "", 40)));
        });

        it('Given email correct , positive distance , flanking sequential1 wrong and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "XABC", "ACB", "", 40)));
        });

        it('Given email correct ,  negative distance, flanking sequential2 wrong and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "ABC", "XACB", "", -40)));
        });

        it('Given email correct , negative distance, flanking sequential1 wrong and flanking sequential1 correct it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoco@cys.com.ar", "XABC", "ACB", "", -40)));
        });

        it('Given  positive distance and empty the rest  parameters  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "", "", "", "", 40)));
        });

        it('Given  negative distance and empty the rest  parameters  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "", "", "", "", -40)));
        });

        it('Given empty  all  parameters  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "", "", "", "",)));
        });

        it('Given email incorrect and the rest parameters required correct  it should return false', () => {

            assert.isFalse(service.isValidDesignData(getBody(4, "ncoccys.com.ar", "ABC", "ABC", "ABC", 40)));
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

    describe('Set Config Patena validation', () => {


        it("Given  sum of frequencies equals 10.000 , it should return true", () => {

            assert.isTrue(service.isValidFrequencies(SumOfFrequenciesToEquals10000));
        });

        it("Given  sum of frequencies less than 10.000 , it should return false", () => {

            assert.isFalse(service.isValidFrequencies(SumOfFrequenciesLessThan10000));
        });

        it("Given  sum of frequencies greater than 10.000 , it should return false", () => {

            assert.isFalse(service.isValidFrequencies(SumOfFrequenciesGreaterThan10000));
        });


        it("Given  any algorithms actived , it should return true", () => {

            assert.isTrue(service.isValidAlgorithms(algorithmsAnyActived));
        });

        it("Given  all algorithms actived , it should return true", () => {

            assert.isTrue(service.isValidAlgorithms(algorithmsAllActived));
        });

        it("Given  all algorithms desactived , it should return false", () => {

            assert.isFalse(service.isValidAlgorithms(algorithmsAllDesactived));
        });

        it("Given  net charge is four , it should return true", () => {

            assert.isTrue(service.isValidNetCharge(4));
        });

    });

});
