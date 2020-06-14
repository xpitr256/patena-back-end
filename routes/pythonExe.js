const {PythonShell} = require('python-shell');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var options = {
    mode: 'text',
    args: ['--seq=abc', '--jobid=550e8400-e29b-41d4-a716-446655440000', '--evaluation-only', '--noblast', '--json']
};

PythonShell.run('./test.py', options, function (err, results) {
    if (err){
        console.error(err);
        throw err;
    }
    // results is an array consisting of messages collected during execution

    //let jsonString = results[0].replaceAll("'","\"");
    //let data = JSON.parse(results);
    console.log("GETTING Back from python:");
    console.log(results);

    const carpeta = '/app/routes/Output';
    const test = require(carpeta + '/results.json');
    console.log("#################### GETTING file path: " + carpeta);
    console.log(test);
});



