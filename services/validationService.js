var extensionValid = ["txt","fasta"];

function isValidOrderNumber(orderNumber) {
  var pattern =/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
  var res =pattern.test(orderNumber);
  return res;
}

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}

function isPositiveNumber(value){
  return ( isInt(value) &&  value > 0 ) ? true :false;
}

function ValidateEmail(inputText)
{
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (isEmpty(inputText)){
    return false;
  }

  if(mailformat.test(String(inputText).toLowerCase()))
  {
     return true;
  }
  else
  {
    return false;
  }
}

function isValidMail (mail) {

  if (isEmpty(mail)){
    return false;
  }

  if (!mail) {
    return false;
  }

  if (!ValidateEmail(mail)) {
    return false;
  }

  return true;
}

function exceedFiftyCaracters (message){

  if (message.trim().length>50){
    return true;
  }
  return false;
}

function isEmpty(input){

  if(!input){
    return true;
  }

  if (input.length === 0){
    return true;
  }

  if (input.trim().length === 0){
    return true;
  }

  return  false;
}

function hasThirtySixCaracters(orderNumber) {
  if (orderNumber.trim().length==36){
    return true;
  }
  return false;
}

function getExtension(filename) {
  return filename.split('.').pop();
}

function isExtensionValid(fileName){
     var ext= getExtension(fileName);
  return extensionValid.includes(ext);
}

module.exports = {

  isValidDistance : function (distance) {

    if (!distance) {
      return false;
    }

    if (!isPositiveNumber(distance)) {
      return false;
    }

    return true;
  },

  isValidDataContact : function (email, name, message){
    return isValidMail(email) && !isEmpty(name) && exceedFiftyCaracters(message);
  },

  isValidOrderNumber : function (orderNumber){
    return isValidOrderNumber(orderNumber) && !isEmpty(orderNumber) && hasThirtySixCaracters(orderNumber);
  },

  isValidForAnalize : function (email,fileName){
    return isValidMail(email) && !isEmpty(email) &&!isEmpty(fileName) && isExtensionValid(fileName)
  }

};
