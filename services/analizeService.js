let taskService = require ('../services/taskService');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = {

    sendOrderNumber : async function(email, sequence) {
        let id =uuidv4();
        // here save field DB and send to process file with patena
        await taskService.save(id,sequence,1,email);
        return id;
    }
};