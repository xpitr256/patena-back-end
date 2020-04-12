#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import os
import errno
import sys
from datetime import date


def create_directory(name):
    try:
        os.mkdir(name)

    except OSError as e:
        if e.errno != errno.EEXIST:
            raise


def getJson():
    data = {'error': {'description': 'Error parametros invalidos', 'date': str(date.today)}}

    if SonArgumentosValidos():
        if sys.argv.__contains__("--noMutations"):
            data = resultAnalyze
        else:
            data = resultDesign
    else:
        data = {'error': {'description': 'Error parametros invalidos', 'date': str(date.today)}}

    return data


def getName():
    if not SonArgumentosValidos():
        return "error"

    return "results"


def create_file(path):
    DATA_RESULT = getJson()
    if path.__contains__(DIR_ROOT_INPUT):
        file = open(path + "/input.json", "w")
        file.write(MOCK_INPUT_DATA)
    if path.__contains__(DIR_ROOT_OUTPUT):
        filename = getName()
        file = open(path + "/" + filename + ".json", "w")
        file.write(str(DATA_RESULT))
    file.close()
    return DATA_RESULT


def SonArgumentosValidos():
    validArguments = ['--seq', 'length', '--beta', '--noMutations', '--db', '--blastweb', '--uvsilent', '--netcharge',
                      '--nopasta', '--noprosite', '--notango', '--noblast', '--verbose', '--noblast', '--notango',
                      '--noiupred',
                      '--noelm', '--noanchor', '--noprosite', '--nolimbo', '--notmhmm', '--nopasta', '--nowaltz',
                      '--noamyloidpattern',
                      '--maxiterations', '--detailed', '--verbose', '--minoutput', '--testoutput', '--gettime',
                      '--jobid', '-a', '-r', '-n',
                      '-d', '-c', '-q', '-e', '-g', '-h', '-i', '-l', '-k', '-m', '-f', '-p', 's', '-t', '-w', '-y',
                      '-v']
    valido = True
    index = 0

    while valido and index < len(sys.argv):
        arg = sys.argv[index]
        print (arg)
        if (arg[0] == '-') or (arg[0] == '-' and arg[1] == '-'):
            valido = arg in validArguments

        index = index + 1
    print (valido)
    return valido


def getDirectory():
    directory = 'UuidJobNotEspecified'
    if '--jobid' in sys.argv:
        index = sys.argv.index('--jobid')
        try:
            directory = sys.argv[index + 1]
            return directory
        except:
            return directory
    else:
        return 'UuidJobNotEspecified'


DIR_ROOT_INPUT = 'Input'
DIR_ROOT_OUTPUT = 'Output'
MOCK_INPUT_DATA = 'MOCKQVCLTAELGLIL'

resultAnalyze = {
    "analysis": {
        "blast": {
            "prop1": "value1",
            "prop2": "value2"
        },
        "otro": {
            "prop3": "value3"
        }
    }
}
resultDesign = {
    "design": {
        "initialSequence": "ABC",
        "finalSequence": "DEF",
        "steps": [
            {
                "changed": "(A) -> D ", "score": "1"
            }
        ]
    }
}

cantDeArgumentos = len(sys.argv)
action = ""
parameter_action = ""

create_directory(DIR_ROOT_INPUT)
create_directory(DIR_ROOT_OUTPUT)


Id = getDirectory()

if Id != '0':
    print(" Procesando su cadena...")
    print("Su Id de proceso: " + str(Id))

PATH_INPUT = DIR_ROOT_INPUT + '/' + str(Id)
PATH_OUTPUT = DIR_ROOT_OUTPUT + '/' + str(Id)

create_directory(PATH_INPUT)
create_directory(PATH_OUTPUT)

create_file(PATH_INPUT)
result_log = create_file(PATH_OUTPUT)

print ("Generando archivos de input y output")

if sys.argv.__contains__('--verbose'):
    print (result_log)

print ("FIN DEL PROCESO")