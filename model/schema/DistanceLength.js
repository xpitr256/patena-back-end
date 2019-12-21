import {Decimal128} from "mongoose";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DistanceLengthSchema = new Schema({
    distance: Decimal128,
    length: Number
});

module.exports = mongoose.model('Length', DistanceLengthSchema);