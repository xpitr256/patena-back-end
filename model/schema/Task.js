const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const taskService = require ('../../services/taskService');

let TaskSchema = new Schema({
    id: String,
    stateId: {type: Number, default: taskService.STATE_PENDING},
    messageError: {type: String, default: ''},
    typeId: Number, // 1-analyze, 2-design
    creationDate: {type:Date, default:Date.now()},
    attempts: {type: Number, default: 0},
    lastExecutionDate: {type:Date, default:null},
    output: {type:Object, default:null},
    emailSent: {type: Boolean, default: false},
    sentEmailDate:{type:Date, default:null},
    taskData: {type:Object, default:null},
    language : {type:String, default:'en'}
});

module.exports = mongoose.model('TaskSchema', TaskSchema);