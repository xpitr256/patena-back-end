const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    taskId: String,
    stateId: {type: Number, default: 1}, // 1-pending execution 2- in action 3-completed successfully 4-cancelled
    messageError: {type: String, default: ''},
    typeId: Number, // 1-analyze, 2-design
    creationDateTask: {type:Date, default:Date.now()},
    attempts: {type: Number, default: 0},
    lastExecutionDate: {type:Date, default:null},
    sequenceOutput: {type: String, default: ''},
    emailSent: {type: Boolean, default: false},
    sentEmailDate:{type:Date, default:null},
    body: {type:Object, default:null},
    language : {type:String, default:'en'}
});

module.exports = mongoose.model('TaskSchema', TaskSchema);