import argparse
import os
import json

parser = argparse.ArgumentParser(description='Evaluate/Generate linker sequences')
parser.add_argument('--seq', nargs=1, help='Starting sequence')
parser.add_argument('--json',dest='json_out',action='store_true',help='Save output to json file')
parser.add_argument("--jobid", action='store', dest='job_id',help="Directs the output to a name of your choice")
parser.add_argument('--evaluation-only', dest="global_evaluation",action='store_true',help='Only perform evaluation steps on the sequence. Do NOT attempt mutations.')
parser.add_argument('--noblast',dest='runBlast',action='store_false')
parser.add_argument('--notango',dest='runTango',action='store_false')
parser.add_argument('--noelm',dest='runElm',action='store_false')
parser.add_argument('--noiupred',dest='runIupred',action='store_false')
parser.add_argument('--noanchor',dest='runAnchor',action='store_false')
parser.add_argument('--noprosite',dest='runProsite',action='store_false')
parser.add_argument('--nolimbo',dest='runLimbo',action='store_false')
parser.add_argument('--notmhmm',dest='runMhmm',action='store_false')
parser.add_argument('--nopasta',dest='runPasta',action='store_false')
parser.add_argument('--nowaltz',dest='runWaltz',action='store_false')
parser.add_argument('--noamyloidpattern',dest='runAmyloidpattern',action='store_false')

parser.add_argument('-a', type=float, default=8.2, dest='userCompositionA')
parser.add_argument('-r', type=float, default=5.5, dest='userCompositionR')
parser.add_argument('-n', type=float, default=4, dest='userCompositionN')
parser.add_argument('-d', type=float, default=5.4, dest='userCompositionD')
parser.add_argument('-c', type=float, default=1.4, dest='userCompositionC')
parser.add_argument('-q', type=float, default=3.9, dest='userCompositionQ')
parser.add_argument('-e', type=float, default=6.8, dest='userCompositionE')
parser.add_argument('-g', type=float, default=7.1, dest='userCompositionG')
parser.add_argument('-hh', type=float, default=2.3, dest='userCompositionH')
parser.add_argument('-i', type=float, default=6, dest='userCompositionI')
parser.add_argument('-l', type=float, default=9.7, dest='userCompositionL')
parser.add_argument('-k', type=float, default=5.8, dest='userCompositionK')
parser.add_argument('-m', type=float, default=2.4, dest='userCompositionM')
parser.add_argument('-f', type=float, default=3.9, dest='userCompositionF')
parser.add_argument('-p', type=float, default=4.7, dest='userCompositionP')
parser.add_argument('-s', type=float, default=6.7, dest='userCompositionS')
parser.add_argument('-t', type=float, default=5.3, dest='userCompositionT')
parser.add_argument('-w', type=float, default=1.1, dest='userCompositionW')
parser.add_argument('-y', type=float, default=2.9, dest='userCompositionY')
parser.add_argument('-v', type=float, default=6.9, dest='userCompositionV')


args = parser.parse_args()
sequence=args.seq
json_out = args.json_out

DIR_ROOT_OUTPUT = '/app/routes/Output'

def create_directory(name):
    try:
        os.makedirs(name,exist_ok=True)

    except OSError as e:
        if e.errno != errno.EEXIST:
            raise


create_directory(DIR_ROOT_OUTPUT)
DATA_RESULT = {
"initialSequence": "pablo_massuh",
"mode": "design",
}

def create_file(path):
    if path.__contains__(DIR_ROOT_OUTPUT):
        with open(path + "/results.json", 'w') as outfile:
            json.dump(DATA_RESULT, outfile)

create_file(DIR_ROOT_OUTPUT)

print(args)



