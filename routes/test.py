#import sys
#import json
import argparse

"""
parametros = '{"aminoacidos": ["A", "Q","R"], "distancia":"0" ,"carga": "+3"}'
parametros_dict = json.loads(parametros)

parametros_dict["aminoacidos"]=sys.argv[1]
listaAmino=parametros_dict["aminoacidos"]

#for amino in listaAmino:
    #print(str(listaAmino.index(amino)+1)+"-"+amino)

"""
parser = argparse.ArgumentParser(description='Evaluate/Generate linker sequences')
parser.add_argument('--seq', nargs=1, help='Starting sequence')
parser.add_argument('--json',dest='json_out',action='store_true',help='Save output to json file')
parser.add_argument("--jobid", action='store', dest='job_id',help="Directs the output to a name of your choice")
parser.add_argument('--evaluation-only', dest="global_evaluation",action='store_true',help='Only perform evaluation steps on the sequence. Do NOT attempt mutations.')

args = parser.parse_args()
sequence=args.seq
json_out = args.json_out
print(args.global_evaluation)


#print(sequence.upper())

"""

if (int(sys.argv[2])>0)  :
    parametros_dict["distancia"]=int(sys.argv[2])*5

parametros_dict["carga"]=str(sys.argv[3])*5

print(parametros_dict)

"""



