const designValidation = require('./designValidation');
const utils = require('./validationUtils');

function isValidOrderNumber(orderNumber) {
  const pattern =/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
  return pattern.test(orderNumber);
}

module.exports = {
  isValidDistance : function (distance) {
    if (!distance) {
      return false;
    }
    return utils.isPositiveDecimal(distance);
  },
  isValidContactData : function (email, name, message){
    return utils.isValidMail(email) && !utils.isEmpty(name) && utils.exceedsFiftyCharacters(message);
  },

  isValidOrderNumber : function (orderNumber){
    return isValidOrderNumber(orderNumber) && utils.hasThirtySixCharacters(orderNumber);
  },
  isValidAnalyzeData : function (email, sequence) {
    if (email) {
      return utils.isValidMail(email) && designValidation.isValidFasta(sequence);
    }
    return designValidation.isValidFasta(sequence);
  },
  isValidDesign: function (data) {
    return designValidation.isValidDesign(data);
  }
};