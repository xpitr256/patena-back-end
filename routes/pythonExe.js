const {PythonShell} = require('python-shell');
/*
var options = {
    mode: 'text',
    args: [['AQR'], '3', '+4']
};
*/
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
//PythonShell.run('./routes/test.py', options, function (err, results) {
/*
parser.add_argument('--evaluation-only', dest="global_evaluation",action='store_true',help='Only perform evaluation steps on the sequence. Do NOT attempt mutations.')
parser.add_argument("--jobid", action='store', dest='job_id',help="Directs the output to a name of your choice")
parser.add_argument('--json',dest='json_out',action='store_true',help='Save output to json file')


parser.add_argument('--length',  type=int, default=12, help='Sequence length')
parser.add_argument('--seq', nargs=1, help='Starting sequence')

//Config one
parser.add_argument('--uvsilent', dest="uvsilent",action='store_true',help='UV silent........')
parser.add_argument('--net-charge', nargs=1, type=int, help='Net charge of the final sequence')
*/


var options = {
    mode: 'text',
    args: ['--seq=abc', '--jobid=550e8400-e29b-41d4-a716-446655440000', '--evaluation-only']
};

PythonShell.run('./test.py', options, function (err, results) {
    if (err){
        console.error(err);
        throw err;
    }
    // results is an array consisting of messages collected during execution

    let jsonString = results[0].replaceAll("'","\"");
    let data = JSON.parse(jsonString);
    console.log("GETTING Back from python:");
    console.log(data);
});



