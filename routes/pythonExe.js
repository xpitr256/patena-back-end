var {PythonShell} = require('python-shell');

var options = {
    mode: 'text',
    args: [['AQR'], '3', '+4']
};

PythonShell.run('test.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
});


