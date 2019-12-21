var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DistanceLengthSchema = new Schema({
    distance: String,
    length: Number
});

module.exports = mongoose.model('Length', DistanceLengthSchema);