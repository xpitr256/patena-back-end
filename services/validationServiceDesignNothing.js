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
function isEmpty(input){

  if(!input){
    return true;
  }

  return input.trim().length === 0;
}

function isPositiveDecimal(value){
  const pattern = /^[0-9]{1,2}(?:.[0-9]{1})?$/;
  return pattern.test(value);
}
module.exports = {
  isValidDistance : function (distance) {

    if (!distance) {
      return false;
    }

    return isPositiveNumber(distance);
  },
  validate: function (body) {
    if (body.email){
      return isValidMail(body.email) && isPositiveDecimal(body.distance) ;
    }
    return isPositiveDecimal(body.distance) ;
  }

};
