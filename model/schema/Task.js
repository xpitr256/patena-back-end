var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
    idTask: String,
    idState: {type: Number, default: 1},//1-pending execution    2- in action     3-completed successfully  4-cancelled
    messageError: {type: String, default: ''},
    idType: Number, // 1-analize, 2-disign
    creationDateTask: Date,
    numberOfAttemps: {type: Number, default: 0},
    lastExecutionDate: {type:Date, default:null},
    sequenceInput: {type: String, default: ''},
    sequenceOutput: {type: String, default: ''},
    email:{type: String, default: ''},
    emailSent: {type: Boolean, default: false},
    sentEmailDate:{type:Date, default:null}
});

module.exports = mongoose.model('TaskSchema', TaskSchema);