const fs = require('fs');
module.exports = {
    getTranslationsIn: function (language) {
        return JSON.parse(fs.readFileSync('./lang/'+language+'.json', 'utf-8'));
    }
};