#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
echo $DIR
INITIALDIR=$PWD
echo $INITIALDIR
export ANCHOR_PATH=$DIR/Tools/ANCHOR
echo $ANCHOR_PATH
export IUPred_PATH=$DIR/Tools/iupred
echo $IUPred_PATH
export PASTA_PATH=$DIR/Tools/PASTA/pasta_exe
echo $PASTA_PATH
cd $ANCHOR_PATH
make clean
make
cd $IUPred_PATH
gcc -w iupred.c -o iupredExe
export PROSITE=$DIR/Tools/Prosite/ps_scan
echo $PROSITE
cd $INITIALDIR
export HEMO="MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR"
echo $HEMO
path_to_blast=$(dirname "$(command -v blastp)")
echo $path_to_blast
export PATH=$path_to_blast:$PATH
echo $PATH
