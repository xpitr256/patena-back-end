let design1 = require('../services/validationServiceDesignNothing.js');
let design2 = require('../services/validationServiceDesignInitialSequence.js');
let design3 = require('../services/validationServiceDesignSequencesFlanking.js');
let design4 = require('../services/validationServiceDesignInitialSequenceAndFlanking');
const aminoAcids = [
  "A",
  "R",
  "N",
  "D",
  "B",
  "C",
  "E",
  "Q",
  "Z",
  "G",
  "H",
  "I",
  "L",
  "K",
  "M",
  "F",
  "P",
  "S",
  "T",
  "W",
  "Y",
  "V"
];

/**
 * Returns true | false according to fasta validations
 */
function isValidFasta(sequence) {
  if (!sequence) {
    return false;
  }
  const lines = sequence.value.toString().split("\n");
  const linesWithoutComments = lines.filter(line => !line.startsWith(">"));
  const allContent = linesWithoutComments.join("").trim();
  if (!allContent) {
    return false;
  }
  for (const aminoAcid of allContent) {
    if (!aminoAcids.includes(aminoAcid)) {
      return false;
    }
  }

  return true;
}

function isValidOrderNumber(orderNumber) {
  const pattern =/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
  return pattern.test(orderNumber);
}

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}

function isPositiveNumber(value){
  return  !!(isInt(value) && value > 0);
}

function validateEmail(inputText) {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return mailFormat.test(String(inputText).toLowerCase());
}

function isValidMail (mail) {

  if (isEmpty(mail)){
    return false;
  }

  return validateEmail(mail);
}

function exceedsFiftyCharacters (message) {
  if(!message) {
    return false;
  }
  return message.trim().length > 50;
}

function isEmpty(input){

  if(!input){
    return true;
  }

  return input.trim().length === 0;
}

function hasThirtySixCharacters(orderNumber) {
  return orderNumber.trim().length === 36;
}

function isValidFile(file) {
  if (isEmpty(file.name)) {
    return false;
  }

  if (!isPositiveNumber(file.size)) {
    return false;
  }

   return isValidExtension(file.name)
}

function getExtension(filename) {
  return filename.split('.').pop();
}

function isValidExtension(fileName) {
  return ["txt","fasta"].includes(getExtension(fileName));
}

function isValid (body){
    let MapDesign = new Map();

    MapDesign.set('design1',design1.validate(body));
    MapDesign.set('design2',design2.validate(body));
    MapDesign.set('design3',design3.validate(body));
    MapDesign.set('design4',design4.validate(body));
    return  MapDesign.get(body.designType);
}

module.exports = {

  isValidDistance : function (distance) {

    if (!distance) {
      return false;
    }

    return isPositiveNumber(distance);
  },

  isValidContactData : function (email, name, message){
    return isValidMail(email) && !isEmpty(name) && exceedsFiftyCharacters(message);
  },

  isValidOrderNumber : function (orderNumber){
    return isValidOrderNumber(orderNumber) && hasThirtySixCharacters(orderNumber);
  },

  isValidAnalyzeData : function (body) {
    return isValidMail(body.email) && isValidFasta(body.sequence);
  },

  isValidDesignData : function (body) {
    return isValid(body);
  }
};
