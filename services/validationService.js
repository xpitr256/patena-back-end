
function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}

function isPositiveNumber(value){
  return ( isInt(value) &&  value > 0 ) ? true :false;
}

function ValidateEmail(inputText)
{
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(mailformat.test(String(inputText).toLowerCase()))
  {
     return true;
  }
  else
  {
    return false;
  }
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

  isValidMail : function (mail) {

    if (!mail) {
      return false;
    }

    if (!ValidateEmail(mail)) {
      return false;
    }

    return true;
  }
};
