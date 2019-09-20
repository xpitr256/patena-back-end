var {PythonShell} = require('python-shell');
const pyshell = new PythonShell('/home/nico/WebstormProjects/patena-back-end/routes/sendtest.py');
let express = require('express');
let router = express.Router();

const data = {"aminoacido":'AQR',"distancia":'3', "carga":'+4'};


router.get('/', function(req, res, next) {

    pyshell.send(JSON.stringify(data));

    pyshell.on('message', function (message) {

        console.log(message);
        res.send(message);
    });

    pyshell.end(err => {
        if (err) res.send("Error : ", err);
    });
});

module.exports = router;
