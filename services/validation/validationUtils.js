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
module.exports = {
    isInt: function(value) {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
    },
    isPositiveDecimal: function(value){
        const pattern = /^[0-9]{1,2}(?:.[0-9]{1})?$/;
        return pattern.test(value);
    },
    isValidMail: function(mail) {
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return mailFormat.test(String(mail).toLowerCase());
    },
    exceedsFiftyCharacters: function(message) {
        return message ? message.trim().length > 50 : false;
    },
    isEmpty: function(input) {
        return input ? input.trim().length === 0 : true;
    },
    hasThirtySixCharacters: function (orderNumber) {
        return orderNumber ? orderNumber.trim().length === 36 : false;
    },
    getAminoAcids: function() {
        return aminoAcids;
    }
}