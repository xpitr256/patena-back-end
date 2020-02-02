var {PythonShell} = require('python-shell');
let express = require('express');
let router = express.Router();


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const data = {"aminoacido":'AQR',"distancia":'3', "carga":'+4'};


router.get('/', function(req, res, next) {

    var {PythonShell} = require('python-shell');

    var options = {
        mode: 'text',
        args: [['AQR'], '3', '+4']
    };

    PythonShell.run('./routes/test.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results from python: %j', results);
        let jsonString = results[0].replaceAll("'","\"");
        res.json(JSON.parse(jsonString));
    });

    /*

    let pyshell = new PythonShell('./sendtest.py');

    data["aminoacido"]=req.query.amino;
    data["distancia"]=req.query.distance;
    data["carga"]=req.query.electron;
   // sends a message to the Python script via stdin
    pyshell.send(JSON.stringify(data));

    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    });

// end the input stream and allow the process to exit
    pyshell.end(function (err,code,signal) {
        if (err) throw err;
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');
        console.log('finished');
    });


     */
});

module.exports = router;
