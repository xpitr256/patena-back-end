let design1 = require('./validationServiceDesignNothing.js');
let design2 = require('./validationServiceDesignInitialSequence.js');
let design3 = require('./validationServiceDesignSequencesFlanking.js');
let design4 = require('./validationServiceDesignInitialSequenceAndFlanking');

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

function isPositiveDecimal(value){
  const pattern = /^[0-9]{1,2}(?:.[0-9]{1})?$/;
  return pattern.test(value);
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

    MapDesign.set(1,design1.validate(body));
    MapDesign.set(2,design2.validate(body));
    MapDesign.set(3,design3.validate(body));
    MapDesign.set(4,design4.validate(body));
    return  MapDesign.get(body.designType);
}

function areValidFrequencies(frequencies){
  let result=0
  
  for (let amino in frequencies){
       result+= parseFloat(frequencies[amino].value);
    }
  return result.toFixed(1)==100.0
}

function isLessThat(netCharge, length) {
  return netCharge<=length;
}

function isValidNetCharge (netCharge = undefined, initialSequence= undefined){
  if (netCharge == undefined || initialSequence == undefined || initialSequence.value == undefined ){ return true};

  return isInt(netCharge) && isLessThat(netCharge,initialSequence.value.length);
}

function areValidAlgorithms(algorithms){

  let anyActived = algorithms.some(function (item) {return  item.active==true;});
  return anyActived;
}

function isValidCustomConfig(body){

  if (body.config){
    return areValidFrequencies(body.config.frequencies) &&
        isValidNetCharge(body.config.netCharge, body.initialSequence) &&
        areValidAlgorithms(body.config.algorithms);
  }

  return true; // if no config then we use default Patena's settings.
}

function isConfigDefault(body){
  return body.config === undefined;
}

module.exports = {

  isValidDistance : function (distance) {

    if (!distance) {
      return false;
    }

    return isPositiveDecimal(distance);
  },

  isValidContactData : function (email, name, message){
    return isValidMail(email) && !isEmpty(name) && exceedsFiftyCharacters(message);
  },

  isValidOrderNumber : function (orderNumber){
    return isValidOrderNumber(orderNumber) && hasThirtySixCharacters(orderNumber);
  },

  isValidAnalyzeData : function (email, sequence) {
    if (email) {
      return isValidMail(email) && isValidFasta(sequence);
    }
    return isValidFasta(sequence);
  },

  isValidDesignData : function (body) {
    return isValid(body) && isValidCustomConfig(body);
  },

  isValidFrequencies : function (frequencies) {
      return areValidFrequencies(frequencies);
  },

  isValidAlgorithms : function (algorithms) {
    return areValidAlgorithms(algorithms);
  },

  isValidNetCharge: function (netCharge){
    return isValidNetCharge(netCharge);
  },

  existAnyValidConfig: function(body){
    return isValidCustomConfig(body) || isConfigDefault(body);
  },

  isValidDesign: function (body) {
    //TODO check everything here, design data + config one.
    return true;
  }

};
