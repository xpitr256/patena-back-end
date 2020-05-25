
const {PythonShell} = require('python-shell');
const constants = require('./constants');

function runPatenaFor(args, workId){
    return new Promise((resolve, reject) => {
        const options = {
            mode: 'text',
            args: args
        };
        PythonShell.run('./test.py', options, function (err, results) {
            if (err){
                console.error("There was an ERROR running PATENA for workId=" + workId);
                console.error(err);
                reject(err);
            }
            resolve(results)
        });
    });
}

function combineSequences(initial, sequence, final, length) {
    // TODO do it.
}

function getSequenceFrom(task) {
    if (task.typeId === constants.TYPE_ANALYSIS) {
        return task.taskData.sequence.value;
    }
    switch (task.taskData.designType) {
        case constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE:
            return task.taskData.initialSequence.value;
        case constants.DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES:
            return combineSequences(task.taskData.flankingSequence1.value,task.taskData.initialSequence.value, task.taskData.flankingSequence2.value, constants.FLANKING_WINDOW_SIZE);
        case constants.DESIGN_TYPE_ONLY_FLANKING_SEQUENCES:
            // TODO ask this case
            return '????'
        default:
            return;
    }
}

function getPatenaArgumentsFor(task) {
    const args = [];
    // Mandatory parameters
    args.push('--jobid=' + task.id);
    args.push('--json');

    // Design / Analysis parameters
    if (task.typeId === constants.TYPE_ANALYSIS) {
        args.push('--evaluation-only');
    }

    const sequence = getSequenceFrom(task);
    if (sequence) {
        args.push('--seq=' + sequence);
    }

    // TODO complete it

    //Config parameters
    return args;
}


module.exports = {
    start: async function (task) {
        const args = getPatenaArgumentsFor(task);
        await runPatenaFor(args, task.id);
    }
}