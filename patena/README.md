# PATENA


-------------------------------------------------------------------------

## Installation guide:

1. clone this repo: git clone https://github.com/ieguinoa/patena
1. To install patena just run: source install.sh


REQUIREMENTS: 
* python
* perl
* biopython
* BLAST: PATENA searches for possible functional elements in the sequences based on sequence homology evidence using a BLAST search against a DB of known protein sequences. blastp should be in PATH and the env variable BLASTDB must be defined as the path to blast DBs dir. The DB of proteins to search against should preferentialy be UniprotKB. The name of the DB is (by default) uniprot_sprot.fasta, although this can be changed using parameter `--db [DB_NAME]`. An alternative option to the local blast is to run web BLAST (`--blastweb`), although this increases considerably the running time.

**NOT TESTED ON WINDOWS**


USAGE:   
```
	python patena.py  [options]
```

OPTIONS:
```	
	--seq [sequence]	Define initial sequence
	--length [seq-length]   Define initial sequence length (and generate a random sequence)
	--verbose		Write detailed output in stdout
	--logoutput		Write mutations history log in file (patena.log)
 	--stepped 		Write detailed output and wait for user input at each step
```



LOG FILE FORMAT:
	Each line has 4 columns. mutation, new sequence, score, loop id[1 | 2]



-------------------------------------------------------------------------

     
## TODO

Functional/code work:
 - move the logging/any print  to be handled by a package (e.g check logmuse or logging ->  https://docs.python.org/2/howto/logging.html#logging-from-multiple-modules
 - Fix the parameters setting mess: switch to argparse, use a config, something.
 - refactorize the call to test a function. This can be easily put in a method that takes the tool name as parameter, as all the context commands are the same (debug, output, etc)
 - Make tests!!


Towards making a Python package out of PATENA:
- add whats missing to make it a complete package with patena command as entry point  (see package template https://github.com/databio/example_python_CLI)
 - Move the bin/external code to a bin dir. Initially it will still be compiled using an install.sh file but all bins should go to a predefined dir with predefined names...no need to set env. variables.
Could add a check to see if the user already has any of these tools installed and in PATH?
 - Same for any other reference files, put them all in a standardized place that python package can reach.


Future plans:
 - Make a conda recipe
 - Can add a way to plug-in any external tests on the sequence? so users can define their own set of tests that want to be applied on it? may be hard to generalize and come up with a simple way for users to define the input/command/output to add a test. 
