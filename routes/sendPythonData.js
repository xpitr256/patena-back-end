var {PythonShell} = require('python-shell');
let express = require('express');
let router = express.Router();

const data = {"aminoacido":'AQR',"distancia":'3', "carga":'+4'};


router.get('/', function(req, res, next) {
    let pyshell = new PythonShell('/home/nico/WebstormProjects/patena-back-end/routes/sendtest.py');

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
});

module.exports = router;
