
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

function exceedsFiftyCharacters (message){
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

  isValidAnalyzeData : function (email, file) {
    return isValidMail(email) && isValidFile(file);
  }
};
