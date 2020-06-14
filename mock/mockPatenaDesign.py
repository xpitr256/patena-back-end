import argparse
import os
import shutil
import json


#**************************
#******* PARAMS *******
parser = argparse.ArgumentParser(description='Evaluate/Generate linker sequences')

## Mandatory
parser.add_argument("--jobid", action='store', dest='job_id',help="Directs the output to a name of your choice")
parser.add_argument('--json',dest='json_out',action='store_true',help='Save output to json file')

## Task information
parser.add_argument('--evaluation-only', dest="global_evaluation",action='store_true',help='Only perform evaluation steps on the sequence. Do NOT attempt mutations.')
parser.add_argument('--seq', nargs=1, help='Starting sequence')
parser.add_argument('--length',  type=int, default=12, help='Sequence length')

## Config
parser.add_argument('--net-charge', nargs=1, type=int, help='Net charge of the final sequence')
#avoided algorithms
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

#amoniacid proportion
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
jobId = args.job_id

DIR_ROOT_INPUT = 'Input'
DIR_ROOT_OUTPUT = 'Output'

def create_directory(name):
    try:
        os.makedirs(name,exist_ok=True)

    except OSError as e:
        if e.errno != errno.EEXIST:
            raise


create_directory(DIR_ROOT_INPUT)
create_directory(DIR_ROOT_OUTPUT)

PATH_INPUT = DIR_ROOT_INPUT + '/' + str(jobId)
PATH_OUTPUT = DIR_ROOT_OUTPUT + '/' + str(jobId)

create_directory(PATH_INPUT)
create_directory(PATH_OUTPUT)

MOCK_INPUT_DATA = 'MOCKQVCLTAELGLIL'

DATA_RESULT = {
"initialSequence": "WGKLLVTTINKLNSFRQTLTPP",
"mode": "design",
"initialScore": 131,
"mutationsHistory": [
  {
    "mutated_sequence": "WGKTLVTTINKLNSFRQTLTPP",
    "mutated_position": 3,
    "previous_residue": "L",
    "replacement_aa": "T",
    "method": "score_difference",
    "score_after_mutation": 120
  },
  {
    "mutated_sequence": "WGKTLVTTINKLNSFKQTLTPP",
    "mutated_position": 15,
    "previous_residue": "R",
    "replacement_aa": "K",
    "method": "score_difference",
    "score_after_mutation": 110
  },
  {
    "mutated_sequence": "WGKALVTTINKLNSFKQTLTPP",
    "mutated_position": 3,
    "previous_residue": "T",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 100
  },
  {
    "mutated_sequence": "WGKALVTSINKLNSFKQTLTPP",
    "mutated_position": 7,
    "previous_residue": "T",
    "replacement_aa": "S",
    "method": "score_difference",
    "score_after_mutation": 94.3
  },
  {
    "mutated_sequence": "WGKALVTSINKLNSFKQTLKPP",
    "mutated_position": 19,
    "previous_residue": "T",
    "replacement_aa": "K",
    "method": "score_difference",
    "score_after_mutation": 91.2
  },
  {
    "mutated_sequence": "WGKALVTSINKLNSFKQTLEPP",
    "mutated_position": 19,
    "previous_residue": "K",
    "replacement_aa": "E",
    "method": "score_difference",
    "score_after_mutation": 88
  },
  {
    "mutated_sequence": "WGKALVTSINKLNGFKQTLEPP",
    "mutated_position": 13,
    "previous_residue": "S",
    "replacement_aa": "G",
    "method": "score_difference",
    "score_after_mutation": 76.3
  },
  {
    "mutated_sequence": "WGKALVTSIRKLNGFKQTLEPP",
    "mutated_position": 9,
    "previous_residue": "N",
    "replacement_aa": "R",
    "method": "score_difference",
    "score_after_mutation": 66.7
  },
  {
    "mutated_sequence": "WGKALVTSIRKLNGFKQTLEAP",
    "mutated_position": 20,
    "previous_residue": "P",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 60
  },
  {
    "mutated_sequence": "WGKALVTQIRKLNGFKQTLEAP",
    "mutated_position": 7,
    "previous_residue": "S",
    "replacement_aa": "Q",
    "method": "score_difference",
    "score_after_mutation": 58
  },
  {
    "mutated_sequence": "WGKALPTQIRKLNGFKQTLEAP",
    "mutated_position": 5,
    "previous_residue": "V",
    "replacement_aa": "P",
    "method": "score_difference",
    "score_after_mutation": 55
  },
  {
    "mutated_sequence": "WGKALPTQIRKLNQFKQTLEAP",
    "mutated_position": 13,
    "previous_residue": "G",
    "replacement_aa": "Q",
    "method": "score_difference",
    "score_after_mutation": 49
  },
  {
    "mutated_sequence": "WGKALDTQIRKLNQFKQTLEAP",
    "mutated_position": 5,
    "previous_residue": "P",
    "replacement_aa": "D",
    "method": "score_difference",
    "score_after_mutation": 44
  },
  {
    "mutated_sequence": "WGRALDTQIRKLNQFKQTLEAP",
    "mutated_position": 2,
    "previous_residue": "K",
    "replacement_aa": "R",
    "method": "score_difference",
    "score_after_mutation": 42.4
  },
  {
    "mutated_sequence": "WGRALDTQIRKLNQFKQTAEAP",
    "mutated_position": 18,
    "previous_residue": "L",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 40
  },
  {
    "mutated_sequence": "WGRALDTVIRKLNQFKQTAEAP",
    "mutated_position": 7,
    "previous_residue": "Q",
    "replacement_aa": "V",
    "method": "score_difference",
    "score_after_mutation": 39.8
  },
  {
    "mutated_sequence": "WGRALDTVIRKLNQFKQTAENP",
    "mutated_position": 20,
    "previous_residue": "A",
    "replacement_aa": "N",
    "method": "score_difference",
    "score_after_mutation": 37
  },
  {
    "mutated_sequence": "WGRALDTVIRCLNQFKQTAENP",
    "mutated_position": 10,
    "previous_residue": "K",
    "replacement_aa": "C",
    "method": "score_difference",
    "score_after_mutation": 33
  },
  {
    "mutated_sequence": "WGRALDKVIRCLNQFKQTAENP",
    "mutated_position": 6,
    "previous_residue": "T",
    "replacement_aa": "K",
    "method": "score_difference",
    "score_after_mutation": 33
  },
  {
    "mutated_sequence": "WGRALDKVIRCLNQFKQTALNP",
    "mutated_position": 19,
    "previous_residue": "E",
    "replacement_aa": "L",
    "method": "score_difference",
    "score_after_mutation": 33
  },
  {
    "mutated_sequence": "WGRALDKVIRTLNQFKQTALNP",
    "mutated_position": 10,
    "previous_residue": "C",
    "replacement_aa": "T",
    "method": "score_difference",
    "score_after_mutation": 33
  },
  {
    "mutated_sequence": "MGRALDKVIRTLNQFKQTALNP",
    "mutated_position": 0,
    "previous_residue": "W",
    "replacement_aa": "M",
    "method": "score_difference",
    "score_after_mutation": 33
  },
  {
    "mutated_sequence": "MGLALDKVIRTLNQFKQTALNP",
    "mutated_position": 2,
    "previous_residue": "R",
    "replacement_aa": "L",
    "method": "score_difference",
    "score_after_mutation": 33
  },
  {
    "mutated_sequence": "MGLALDKVIRTLNQFKQQALNP",
    "mutated_position": 17,
    "previous_residue": "T",
    "replacement_aa": "Q",
    "method": "MC",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "MGLALDKVIRTLNQFKQQALVP",
    "mutated_position": 20,
    "previous_residue": "N",
    "replacement_aa": "V",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "MGLALDKVIRTLNQFKQQALFP",
    "mutated_position": 20,
    "previous_residue": "V",
    "replacement_aa": "F",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "MGYALDKVIRTLNQFKQQALFP",
    "mutated_position": 2,
    "previous_residue": "L",
    "replacement_aa": "Y",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "MGYALDKVIRTLNQFKQQALFN",
    "mutated_position": 21,
    "previous_residue": "P",
    "replacement_aa": "N",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "MGYALDKVIRTLNQFKQQALPN",
    "mutated_position": 20,
    "previous_residue": "F",
    "replacement_aa": "P",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "AGYALDKVIRTLNQFKQQALPN",
    "mutated_position": 0,
    "previous_residue": "M",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "AGYALDKVIRTLNQFKQQALPG",
    "mutated_position": 21,
    "previous_residue": "N",
    "replacement_aa": "G",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "AGYALDKVIRTLNQFPQQALPG",
    "mutated_position": 15,
    "previous_residue": "K",
    "replacement_aa": "P",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "AGYALDKVIRTVNQFPQQALPG",
    "mutated_position": 11,
    "previous_residue": "L",
    "replacement_aa": "V",
    "method": "score_difference",
    "score_after_mutation": 30
  },
  {
    "mutated_sequence": "AGYALDKVIRTVNGFPQQALPG",
    "mutated_position": 13,
    "previous_residue": "Q",
    "replacement_aa": "G",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "APYALDKVIRTVNGFPQQALPG",
    "mutated_position": 1,
    "previous_residue": "G",
    "replacement_aa": "P",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "APYALGKVIRTVNGFPQQALPG",
    "mutated_position": 5,
    "previous_residue": "D",
    "replacement_aa": "G",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "APYALGKVLRTVNGFPQQALPG",
    "mutated_position": 8,
    "previous_residue": "I",
    "replacement_aa": "L",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "APYALGKVLRTVNGFPQQALPA",
    "mutated_position": 21,
    "previous_residue": "G",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "APYALGKVLREVNGFPQQALPA",
    "mutated_position": 10,
    "previous_residue": "T",
    "replacement_aa": "E",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "APYALGKVLREVNGFPQQAMPA",
    "mutated_position": 19,
    "previous_residue": "L",
    "replacement_aa": "M",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "APYALGKVLQEVNGFPQQAMPA",
    "mutated_position": 9,
    "previous_residue": "R",
    "replacement_aa": "Q",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "LPYALGKVLQEVNGFPQQAMPA",
    "mutated_position": 0,
    "previous_residue": "A",
    "replacement_aa": "L",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "LPYALGKVLSEVNGFPQQAMPA",
    "mutated_position": 9,
    "previous_residue": "Q",
    "replacement_aa": "S",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "LPYALGKVLSEVNGFPQKAMPA",
    "mutated_position": 17,
    "previous_residue": "Q",
    "replacement_aa": "K",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GPYALGKVLSEVNGFPQKAMPA",
    "mutated_position": 0,
    "previous_residue": "L",
    "replacement_aa": "G",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GPYALGKVLSRVNGFPQKAMPA",
    "mutated_position": 10,
    "previous_residue": "E",
    "replacement_aa": "R",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GPYALGKVLSRVNGFPWKAMPA",
    "mutated_position": 16,
    "previous_residue": "Q",
    "replacement_aa": "W",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GPYAMGKVLSRVNGFPWKAMPA",
    "mutated_position": 4,
    "previous_residue": "L",
    "replacement_aa": "M",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GPYAMGKVISRVNGFPWKAMPA",
    "mutated_position": 8,
    "previous_residue": "L",
    "replacement_aa": "I",
    "method": "MC",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GPYAMGKVNSRVNGFPWKAMPA",
    "mutated_position": 8,
    "previous_residue": "I",
    "replacement_aa": "N",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GPYAMGKVDSRVNGFPWKAMPA",
    "mutated_position": 8,
    "previous_residue": "N",
    "replacement_aa": "D",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GDYAMGKVDSRVNGFPWKAMPA",
    "mutated_position": 1,
    "previous_residue": "P",
    "replacement_aa": "D",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVDSRVNGFPWKAMPA",
    "mutated_position": 1,
    "previous_residue": "D",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVVSRVNGFPWKAMPA",
    "mutated_position": 8,
    "previous_residue": "D",
    "replacement_aa": "V",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVVSRVNGFPWKAMPP",
    "mutated_position": 21,
    "previous_residue": "A",
    "replacement_aa": "P",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVASRVNGFPWKAMPP",
    "mutated_position": 8,
    "previous_residue": "V",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVASSVNGFPWKAMPP",
    "mutated_position": 10,
    "previous_residue": "R",
    "replacement_aa": "S",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVASSVNGKPWKAMPP",
    "mutated_position": 14,
    "previous_residue": "F",
    "replacement_aa": "K",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVASSVNGAPWKAMPP",
    "mutated_position": 14,
    "previous_residue": "K",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVASSVNGFPWKAMPP",
    "mutated_position": 14,
    "previous_residue": "A",
    "replacement_aa": "F",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVASSNNGFPWKAMPP",
    "mutated_position": 11,
    "previous_residue": "V",
    "replacement_aa": "N",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVASSNLGFPWKAMPP",
    "mutated_position": 12,
    "previous_residue": "N",
    "replacement_aa": "L",
    "method": "score_difference",
    "score_after_mutation": 25
  },
  {
    "mutated_sequence": "GAYAMGKVTSSNLGFPWKAMPP",
    "mutated_position": 8,
    "previous_residue": "A",
    "replacement_aa": "T",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GAYAMGKVTSSNLGFPWKAMPI",
    "mutated_position": 21,
    "previous_residue": "P",
    "replacement_aa": "I",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GAYAMGKVTSSNLGFPAKAMPI",
    "mutated_position": 16,
    "previous_residue": "W",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GATAMGKVTSSNLGFPAKAMPI",
    "mutated_position": 2,
    "previous_residue": "Y",
    "replacement_aa": "T",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GATAMGKVTSSNLGFPLKAMPI",
    "mutated_position": 16,
    "previous_residue": "A",
    "replacement_aa": "L",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GATAMGKVTSSNLGFPLKAMPV",
    "mutated_position": 21,
    "previous_residue": "I",
    "replacement_aa": "V",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GATAMGKVSSSNLGFPLKAMPV",
    "mutated_position": 8,
    "previous_residue": "T",
    "replacement_aa": "S",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GATAMGKVQSSNLGFPLKAMPV",
    "mutated_position": 8,
    "previous_residue": "S",
    "replacement_aa": "Q",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GATAMGKVQSSNLGFPLAAMPV",
    "mutated_position": 17,
    "previous_residue": "K",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GATAMGKVQSSNLGFPLANMPV",
    "mutated_position": 18,
    "previous_residue": "A",
    "replacement_aa": "N",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GAFAMGKVQSSNLGFPLANMPV",
    "mutated_position": 2,
    "previous_residue": "T",
    "replacement_aa": "F",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GAFAMGKVQSSNAGFPLANMPV",
    "mutated_position": 12,
    "previous_residue": "L",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 20
  },
  {
    "mutated_sequence": "GAFAMGKVQSDNAGFPLANMPV",
    "mutated_position": 10,
    "previous_residue": "S",
    "replacement_aa": "D",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKVQKDNAGFPLANMPV",
    "mutated_position": 9,
    "previous_residue": "S",
    "replacement_aa": "K",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKVQKDNAAFPLANMPV",
    "mutated_position": 13,
    "previous_residue": "G",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKVQKDEAAFPLANMPV",
    "mutated_position": 11,
    "previous_residue": "N",
    "replacement_aa": "E",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKVQKDEAAFPLAQMPV",
    "mutated_position": 18,
    "previous_residue": "N",
    "replacement_aa": "Q",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKWQKDEAAFPLAQMPV",
    "mutated_position": 7,
    "previous_residue": "V",
    "replacement_aa": "W",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKWQKDEAMFPLAQMPV",
    "mutated_position": 13,
    "previous_residue": "A",
    "replacement_aa": "M",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKWQQDEAMFPLAQMPV",
    "mutated_position": 9,
    "previous_residue": "K",
    "replacement_aa": "Q",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKWQHDEAMFPLAQMPV",
    "mutated_position": 9,
    "previous_residue": "Q",
    "replacement_aa": "H",
    "method": "score_difference",
    "score_after_mutation": 10
  },
  {
    "mutated_sequence": "GAFAMGKWAHDEAMFPLAQMPV",
    "mutated_position": 8,
    "previous_residue": "Q",
    "replacement_aa": "A",
    "method": "score_difference",
    "score_after_mutation": 5
  }
],
"finalScore": 0,
"finalSequence": "GAFAMGKWAHDEAMFPLAQMPV"
}

def create_file(path):
    if path.__contains__(DIR_ROOT_INPUT):
        file = open(path + "/input.json", "w")
        file.write(MOCK_INPUT_DATA)
    if path.__contains__(DIR_ROOT_OUTPUT):
        with open(path + "/results.json", 'w') as outfile:
            json.dump(DATA_RESULT, outfile)

create_file(PATH_INPUT)
create_file(PATH_OUTPUT)

shutil.rmtree(PATH_INPUT, ignore_errors=True)

print("Mock PATENA finished OK")