import sys
import json

parametros = '{"aminoacidos": ["A", "Q","R"], "distancia":"0" ,"carga": "+3"}'
parametros_dict = json.loads(parametros)

parametros_dict["aminoacidos"]=sys.argv[1]
listaAmino=parametros_dict["aminoacidos"]

#for amino in listaAmino:
    #print(str(listaAmino.index(amino)+1)+"-"+amino)


if (int(sys.argv[2])>0)  :
    parametros_dict["distancia"]=int(sys.argv[2])*5

parametros_dict["carga"]=str(sys.argv[3])*5

print(parametros_dict)



