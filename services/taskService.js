const Task = require ('../model/schema/Task');

async function save(id,sequence,idType,email){
        try {
            task = new Task({
                idTask: id,
                idType:idType,
                idState:1,
                creationDateTask: Date.now(),
                sequenceInput: sequence.value,
                email:email,
                emailSent: false,

            });
            await task.save();
        } catch (e) {
            console.error(e);
            return e;
        }
}

module.exports = {

    save: async function (id,sequence,idType,email) {
        return await save(id,sequence,idType,email);
    }
}