var {PythonShell} = require('python-shell');

var options = {
    mode: 'text',
    args: [['AQR'], '3', '+4']
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

PythonShell.run('./test.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution

    let jsonString = results[0].replaceAll("'","\"")
    let data = JSON.parse(jsonString);
    console.log(data);
});



