module.exports = {
    isInt: function(value) {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
    },
    isPositiveDecimal: function (value){
        const pattern = /^[0-9]{1,2}(?:.[0-9]{1})?$/;
        return pattern.test(value);
    },
    validateEmail: function (inputText) {
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return mailFormat.test(String(inputText).toLowerCase());
    },
    isValidMail: function  (mail) {
        if (isEmpty(mail)){
            return false;
        }
        return validateEmail(mail);
    },
    exceedsFiftyCharacters: function  (message) {
        if(!message) {
            return false;
        }
        return message.trim().length > 50;
    },
    isEmpty: function (input) {
        if(!input){
            return true;
        }
        return input.trim().length === 0;
    },
    hasThirtySixCharacters: function (orderNumber) {
        return orderNumber.trim().length === 36;
    }
}