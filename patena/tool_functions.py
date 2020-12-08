import os
import sys
import re
import subprocess

#  OUTPUT FORMATTING
endl = "\n"
tab = "\t"
space=" "
indent=""
#get base path
def get_script_path():
    return os.path.dirname(os.path.realpath(sys.argv[0]))

base_path = get_script_path() + '/'
toolsPath = base_path + 'Tools/'    #**************************TODO SET THE PATH TO THE TOOL SET 



def run_elm_search(sequence,outputsPath,verbose,detailed_output):
    ##MAKE THE SEARCH AND SAVE RESULTS IN outputELM
    elm_pattern_dict = {}
    with open(toolsPath + "ELM/elm_patterns_20150301.txt", 'rU') as file_open :
        patterns = file_open.readlines()
        for line in patterns :
            line = line.split("\t")
            elm_id = line[0]
            elm_pattern = line[1].replace("\n","")
            elm_pattern_dict[elm_id] = elm_pattern
    #print "SEARCHING ELMS IN %s\n ..." % filename
    elm_pattern_desc_dict = {}
    if verbose or detailed_output:     #ONLY IF ITS REQUIRED TO PRINT A DETAILED A OUTPUT, READ THE DESCRIPTION OF EACH ELM FROM A DIFFERENT FILE
         with open(toolsPath + "ELM/elm_patterns_desc_20150301.txt", 'rU') as file_desc_open :
            patterns_desc = file_desc_open.readlines()
            for line in patterns_desc :
                line = line.split("\t")
                elm_id = line[0]
                #print line[1]
                elm_pattern_desc = line[1].replace("\n","")
                elm_pattern_desc_dict[elm_id] = elm_pattern_desc
    #output_file_name = "elms_search_in_%s.txt" % filename[:-4]
    output_file_name=outputsPath + "outputELM"
    uniprot_list = []
    sequence_dict = {}
    #with open(filename, 'rU') as file_open :
  	  #my_seq = file_open.read()
    with open(output_file_name, 'w') as file_write :
        for elm_id in elm_pattern_dict :
            where_to_start = []
            elm_pos_dict = {}
            pattern = re.compile('(?=%s)' % elm_pattern_dict[elm_id])
            for matched_string in pattern.finditer('%s' % sequence) :
                where_to_start.append(matched_string.start())
                pattern = re.compile(elm_pattern_dict[elm_id])
                for index in where_to_start :
                    match = re.search(pattern, '%s' % sequence[index:])
                    if match != None :
                        #if detailed_output:
                        #	detailedOutFile.write(tab + str(index+1) + tab + str(index+len(match.group())) + tab+ elm_id +tab+ elm_pattern_desc_dict[elm_id] + '\n')	
                        if verbose or detailed_output:     #write description next to the indexes
                            #print elm_id
                            file_write.write(str(index+1) + tab + str(index+len(match.group())) + tab+ elm_id +tab+ elm_pattern_desc_dict[elm_id] + '\n')
                            #file_write.write("%s\t%s\t%s\t%s\n" % (index+1, index+len(match.group()) , elm_id , elm_pattern_desc_dict[elm_id] ))
                        else:
                            file_write.write("%s\t%s\n" % (index+1, index+len(match.group())))



def elmSearch(sequence, positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    run_elm_search(sequence,outputsPath,verbose,detailed_output)   #SEARCH FOR MOTIFS IN MY SEQUENCE AND SAVE RESULTS IN A FILE
    elm_scores = []
    for p in range(len(sequence)):
        elm_scores.append(0)
    #print "largoo:" + str(len(sequence))
    hitsFile=outputsPath + "outputELM"    #THE OUTPUT OF THE SEARCH CONTAINS THE LIST OF ELMs FOUND, NOW I HAVE TO PROCESS IT
    with open(hitsFile, "r") as input_file:
        lines=input_file.readlines()
    if detailed_output:
        detailedOutFile.write('ELM: search functional features using Eukaryotic linear motifs')
        detailedOutFile.write('Results:\n')
        detailedOutFile.write('Pattern match - start - end\n')
    # if verbose:
      # print indent + "ELM Search:"
    for line in lines:
        line=line.split("\t")
        pattern_start=int(line[0])
        pattern_end=int(line[1])
        if detailed_output:
            detailedOutFile.write(line[2] + '\t' + str(pattern_start) + '\t' +str(pattern_end) + '\n')
        if verbose:
            print(indent + "Pattern found: " + line[2])
            print(indent + "start:" + str(pattern_start))
            print(indent + "end:" + str(pattern_end))
        for x in range(pattern_start-1,pattern_end):
            elm_scores[x]+=1
            #print str(x)
    if verbose:
        # print ""
        print(indent + "ELM Search RESULTS:")
        data = [sequence,elm_scores]
        col_width = max(len(str(word)) for row in data for word in row)
        for row in data:
            print(indent + "|".join(str(word).ljust(col_width) for word in row))
        #print indent + '\t'.join(map(str, sequence))
        #for u in range(len(sequence)):
          #if sequence[u]>=10:
            #sys.stdout.write(sequence[u])
            #sys.stdout.write(" ")
          #else:
            #sys.stdout.write(sequence[u])
            #sys.stdout.write("  ")
        #print endl
        #print indent + '\t'.join(map(str, elm_scores))
    ##ADD hits to global score
    for i in range(len(sequence)):
        positionScores[i]+=elm_scores[i]


def iupred(sequence, positionScores,config_params, inputsPath,outputsPath,verbose,detailed_output):
    iupredThreshold = config_params['iupredThreshold']
    runCommand = toolsPath + "iupred/iupredExe"+ space + inputsPath + "sequenceFASTA" +space+ "long" + space + outputsPath + "outIUPred"
    #input=open(inputsPath+"iupred/inputIupred"+exeid, 'w')
    #input.write("Name" + endl)
    #input.write(sequence)
    #input.close()
    os.system(runCommand)
    outputIUPred = open(outputsPath + "outIUPred", "r")
    if detailed_output:
        detailedOutFile.write('IUPred: search for well-defined tertiary structure \n')
        detailedOutFile.write('Threshold: ' + str(iupredThreshold) + '\n')
        detailedOutFile.write('Results\n') 
    #PRINT THE RESULTS OF IUPred
    if verbose or detailed_output:
        iupredScores = []
        iterOutputIUPred = iter(outputIUPred)
        for p in range(len(sequence)):
            iupredScores.append(0)
        for x in range(len(sequence)):
            resultX = float(next(iterOutputIUPred))
            if detailed_output and (resultX < iupredThreshold):
                detailedOutFile.write('Position ' + str(x) + ' below threshold with value ' + str(resultX)+'\n')
            if resultX < iupredThreshold :
                iupredScores[x] = 1
        #print endl
        if verbose:
            print(indent + "RESULTS:")
            # print indent + 'Threshold: '+ str(iupredThreshold)
            #print indent + sequence
            #print indent + ''.join(map(str, iupredScores))
        data = [sequence,iupredScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
            if verbose:
                print(indent + "|".join(str(word).ljust(col_width) for word in row))
        outputIUPred.seek(0)
        rstFile_iter = iter(outputIUPred)
        #ADD 1 TO THE POSITION IN positionScores IF THE RESULT IS LESS THAN 0.5 (PREDICTING A GLOBULAR TENDENCY)
        for j in range(len(sequence)):
            resultJ=float(next(rstFile_iter))
            if resultJ < iupredThreshold :
                positionScores[j] += 1


def anchor(sequence, positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    anchorThreshold = config_params['anchorThreshold']
    inputAnchor = inputsPath + "sequenceFASTA"
    runCommand = toolsPath + "ANCHOR/anchor" + space + inputAnchor + space + outputsPath + "outAnchor"
    os.system(runCommand)
    outputAnchor = open(outputsPath + "outAnchor", "r")
    if detailed_output:
        detailedOutFile.write('ANCHOR: Search for binding regions in IDP\n')
        detailedOutFile.write('Threshold: ' + str(anchorThreshold) + '\n')
        detailedOutFile.write('Results \n')
    if verbose:
        print(indent + 'Threshold: ' + str(anchorThreshold))
    anchorScores=[]
    iterOutputAnchor=iter(outputAnchor)
    for p in range(len(sequence)):
        anchorScores.append(0)
    for x in range(len(sequence)):
        resultX=float(next(iterOutputAnchor))
        if detailed_output and (resultX >  anchorThreshold):
            detailedOutFile.write('Position ' + str(x) + ' above threshold with value: ' + str(resultX) + '\n')
        if resultX >  anchorThreshold :
            anchorScores[x] = 1
    #PRINT THE RESULTS OF ANCHOR
    if verbose:
        print(indent + "RESULTS:")
        data = [sequence,anchorScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
            print(indent + "|".join(str(word).ljust(col_width) for word in row))
    outputAnchor.seek(0)
    rstFile_iter = iter(outputAnchor)
    #ADD 1 TO POSITIONS IN positionScores  IF THE RESULT IS GREATER THAN Threshold (PREDICTING A DISORDERED BINDING REGION)
    for j in range(len(sequence)):
        resultJ=float(next(rstFile_iter))
        if resultJ > anchorThreshold :
            positionScores[j] += 1


def pastaSearch(sequence,positionScores,config_params,inputsPath, outputsPath,verbose,detailed_output):
    pastaThreshold=config_params['pastaThreshold']
    input=open(inputsPath + "seq.fasta" , "w")
    input.write(">gi" + endl)
    input.write(sequence)
    input.close()
    pastaPath=toolsPath + 'PASTA/pasta_exe/'
    runCommand = "perl " + pastaPath+'PastaPairs.pl' + space + pastaPath +'pot_pasta.dat '+ inputsPath + " 1 0 self " + str(pastaThreshold) + space + pastaPath + " > /dev/null"
    #print 'comando:' + runCommand
    os.system(runCommand)
    ### CHECK THIS!!! THE OUTPUT IS IN THE SAME DIR AS INPUT (CHECK PASTA PERL SCRIPT)
    outputPasta=open(inputsPath + "seq-seq.best_pairings_list.pair.dat")
    pastaScores=[]
    for p in range(len(sequence)):
        pastaScores.append(0)
    if detailed_output:
        detailedOutFile.write('PASTA: predict aggregation-prone portions of the sequence\n')
        detailedOutFile.write('Threshold: ' + str(pastaThreshold) + '\n')
    if verbose:
        print(indent + 'Threshold: ' + str(pastaThreshold))
    for line in outputPasta.readlines():
        #print line.split()[9]
        #print line.split()[10]
        #print line.split()[11]
        #print line.split()[12]
        pairingEnergyValue=float(line.split()[4])
        if pairingEnergyValue < pastaThreshold:
            #TODO: NEED TO CHECK THE OTHER SEGMENT OF PAIRING IF ITS DIFFERENT
            fromP, dash,toP = (line.split()[9]).partition('-')
            #print str(fromP) + str(dash) + str(toP)
            for hits in range(int(fromP)-1,int(toP)):
                #set scoring=1 so the value is not incremented so much
                pastaScores[hits]=+1
            if detailed_output:
                detailedOutFile.write(str(line.split()[4]) + tab + 'Segment ' + str(line.split()[9]) + ' and segment ' + str(line.split()[11]) + ' in ' + str(line.split()[12]) + ' have a pairing energy value (PASTA UNITS) of '+ str(line.split()[4]) + ' which is lower than the threshold' '\n')
            if verbose:
                print('Hit:')
                print('Energy value: ' + line.split()[4])
                print('Positions:    ' + line.split()[9] + ' and ' + line.split()[11] + ' ' + line.split()[12])
    #position=0
    if verbose:
        print("RESULTS:")
        data = [sequence,pastaScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
            print(indent + "|".join(str(word).ljust(col_width) for word in row))
    for x in range(0,len(sequence)):
        if pastaScores[x] > 0:
            positionScores[x] += pastaScores[x]



def prositeSearch(sequence,positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    #NEW LIST TO SAVE HITS
    prositeScores=[]
    for p in range(len(sequence)):
        prositeScores.append(0)
    #SEARCH PROSITE USING PS_SCAN
    inputProsite=inputsPath + "sequenceFASTA"
    #input=open(inputsPath + "sequence" , "w")
    #input.write(">gi" + endl)
    #input.write(sequence)
    #input.close()
    if detailed_output:
        detailedOutFile.write('PROSITE: search protein domains, families and functional sites\n' )
        detailedOutFile.write('Site start - end - description \n')
    proc = subprocess.Popen(['perl', toolsPath + 'Prosite/ps_scan/ps_scan.pl','-r','-o', 'scan', inputProsite],stdout=subprocess.PIPE,encoding='utf-8')
    hits=False
    for line in proc.stdout:
        if line != '':
            hits=True
            pattern_start=int(line.split()[0])
            pattern_end=int(line.split()[2])
            for x in range(pattern_start-1,pattern_end):
                prositeScores[x]+=1
            if verbose:
                print(indent + "Hit: " + line.strip('\n'))
            if detailed_output:
                detailedOutFile.write(line)
            #print "Hit:" + line.split()[0] + "-" +line.split()[1] + space +  line.split()[2] + space + line.split()[3] + space + line.split()[4]
        else:
            break
    if not hits:
        if detailed_output:
            detailedOutFile.write('NO HITS FOUND')
    if verbose:
        #print endl
        print(indent + "RESULTS:")
        #print indent + sequence
        #print indent + ''.join(map(str, prositeScores))
        data = [sequence,prositeScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
            print(indent + "|".join(str(word).ljust(col_width) for word in row))
    ##ADD hits to global score
    for i in range(len(sequence)):
        positionScores[i]+=prositeScores[i]


  ######################################################################################
  ##########################       LIMBO EVALUATION     #####################################
  ######################################################################################
def limboEval(sequence, positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    #input=open(inputsPath + "sequenceLimbo" + exeId, "w")
    #input.write(">gi" + endl)
    #input.write(sequence)
    #input.close()
    outputLimbo= outputsPath + "outLimbo"
    if detailed_output:
        detailedOutFile.write('Limbo: Search for chaperone binding site\n ')
    #if verbose:
      #print indent + "LIMBO SEARCH:"
    #CALL LIMBO :   score.py + matrix + input + outpout
    runCommand="python" + space + toolsPath + "Limbo/score.py" + space + toolsPath+"Limbo/mergedmatrix.mat" + space + inputsPath + "sequenceFASTA" + space + outputLimbo
    os.system(runCommand)
    outputLimbo=open(outputLimbo,'r')
    limboScores=[]
    if detailed_output:
        detailedOutFile.write('Results: hit start - hit end \n')
    for p in range(len(sequence)):
        limboScores.append(0)
    for line in outputLimbo.readlines():
        #print line.split()[1]
        hitStart=int(line.split()[0])  #first column is the start of the heptapeptide hit
        if detailed_output:
            detailedOutFile.write(str(hitStart) + tab + str(hitStart+5) + '\n')
        for y in range(hitStart-1,hitStart+6):
            limboScores[y] += 1
    for x in range(0,len(sequence)):
        positionScores[x] += limboScores[x]
    if verbose:
        print(indent + "RESULTS:")
        #print indent + sequence
        #print indent + ''.join(map(str, limboScores))
        data = [sequence,limboScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
            print(indent + "|".join(str(word).ljust(col_width) for word in row))



def tmhmmEval(sequence, positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    #input=open("sequenceTmhmm", "w")
    #input.write(">gi" + endl)
    #input.write(sequence)
    #input.close()
    outputTmhmm = outputsPath + "outTmhmm"
    runCommand = toolsPath + "tmhmm/bin/tmhmm" + space + inputsPath + "sequenceFASTA" + space + ">" + outputTmhmm
    os.system(runCommand)
    outputTmhmm = open(outputTmhmm,'r')
    tmhmmScores = []
    if detailed_output:
        detailedOutFile.write('TMHMM: search for transmembrane helices in the sequence\n')
        detailedOutFile.write('Hit start - Hit end\n')
    for p in range(len(sequence)):
        tmhmmScores.append(0)
    for line in outputTmhmm.readlines():
        if line.split()[0] == "TMhelix":
            hitStart=int(line.split()[1])-1 
            hitEnd=int(line.split()[2])
            if detailed_output:
                detailedOutFile.write(str(hitStart) + tab + str(hitEnd)+ '\n')
            for y in range(hitStart,hitEnd):
                tmhmmScores[y] += 1
    if verbose:
        print(indent + "TMHMM RESULTS:")
        #print indent + sequence
        #print indent + ''.join(map(str, tmhmmScores))
        data = [sequence,tmhmmScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
            print(indent + "|".join(str(word).ljust(col_width) for word in row))
    for x in range(0,len(sequence)):
        positionScores[x] += tmhmmScores[x]



def amyloidPatternSearch(sequence, positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    amyloidScore = []
    for p in range(len(sequence)):
        amyloidScore.append(0)
   #TODO READ PATTERN FROM FILE IN Tools DIR
    pattern = re.compile("[^P][^PKRHW][VLSCWFNQE][ILTYWFNE][FIY][^PKRH]")
    where_to_start = []
    #elm_pos_dict = {}
    hits = False
    if detailed_output:
        detailedOutFile.write('Searching determinants for amyloid formation in acidic pH\n')
    for matched_string in pattern.finditer('%s' % sequence) :
        where_to_start.append(matched_string.start())
        #pattern = re.compile("[^P][PKRHW][VLSCWFNQE][ILTYWFNE][FIY][^PKRH]")
        for index in where_to_start :
            match = re.search(pattern, '%s' % sequence[index:])
            if match != None :
                hits=True
                if detailed_output:
                    detailedOutFile.write("Sequence determinant found: ")
                    detailedOutFile.write("Start: " + str(index) + ' - End: ' + str(len(match.group())) )
                if verbose: 
                    print(indent + "Acidic pH: SEQUENCE DETERMINANT FOUND ")
                for x in range(index,index+len(match.group())):
                    amyloidScore[x] += 1
    if verbose or detailed_output:
        if hits:
            if verbose:
                print(indent + "Sequence determinants for amyloid formation in acidic pH: FOUND")
            data = [sequence,amyloidScore]
            col_width = max(len(str(word)) for row in data for word in row)   # padding
            for row in data:
                print(indent + "|".join(str(word).ljust(col_width) for word in row))
        else:
            if verbose:
                print(indent + 'NO HITS')
            else:
                detailedOutFile.write('NO hits found \n')



def waltzSearch(sequence, positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    waltzThreshold = config_params['waltzThreshold']
    if detailed_output:
        detailedOutFile.write('WALTZ: prediction of amylogenic regions \n')
        detailedOutFile.write( "Threshold: " + str(waltzThreshold) + '\n')
    #if verbose:
        #print indent + "WALTZ SEARCH"
        # print indent + "Threshold: " + str(waltzThreshold)
    #EXECUTE WALTZ EVALUATION
    inputWaltz = inputsPath + "sequenceFASTA"
    proc = subprocess.Popen(['perl', toolsPath + 'waltz/scoreMatrixGT.pl', inputWaltz, toolsPath + 'waltz/616.mat', 'full', str(waltzThreshold)],stdout=subprocess.PIPE)

    #PROCESS OUTPUT  
    waltzScores = []
    for p in range(len(sequence)):
        waltzScores.append(0)
    #for line in iter(proc.stdout.readline,''):
    for q in range(0,len(sequence)-5):
        line = proc.stdout.readline()
        #print line.rstrip()
        #print line.split()[0]
        #print line.split()[1]
        if float(line.split()[2])> waltzThreshold:
            hit_start = int(line.split()[1]) - 1
            hit_end = hit_start + 6
            for x in range(hit_start,hit_end):
                waltzScores[x] = 1
            if detailed_output:
                detailedOutFile.write('Subsequence ' + str(hit_start) + ' - ' + str(hit_end) + ' is above threshold with value ' + str(line.split()[2])+'\n')	
  #for q in range(0,len(sequence)-5):
   # line = proc.stdout.readline()
    #if float(line.split()[2])> waltzThreshold:
	#  if verbose:
	 #    print indent + 'Subsequence above threshold: ' +  line.split()[0]
	 # hit_start=int(line.split()[1]) - 1
          #hit_end=hit_start + 6
          #for x in range(hit_start-1,hit_end):
          #  waltzScores[x]+=1
    #else:
      #break

    #position=0
    if verbose:
        print(indent + "RESULTS:")
        #print indent + sequence
        #print indent + ''.join(map(str, waltzScores))
        data = [sequence,waltzScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
            print(indent + "|".join(str(word).ljust(col_width) for word in row))

    for x in range(0,len(sequence)):
        if waltzScores[x] > 0:
            positionScores[x] += 1


def tangoSearch(sequence, positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    tangoThreshold = config_params['tangoThreshold']
    outputTango = outputsPath+"tangoResults.txt"
    #  32bits bin
    #runCommand=toolsPath + 'tango/tango_i386_release tangoResults nt="N" ct="N" ph="7" te="298" io="0.05" seq="' + sequence + '" > /dev/null' 

    #COULD NOT CHANGE THE OUTPUT PATH OF TANGO SO I HAVE TO CHANGE DIR MOMENTLY TO GET THE OUTPUT 
    os.chdir(outputsPath)
    runCommand=toolsPath + 'tango/tango_x86_64_release tangoResults nt="N" ct="N" ph="7" te="298" io="0.05" seq="' + sequence + '" > /dev/null'
    #print runCommand 
    os.system(runCommand)
    outputTango=open(outputTango,'r')
    os.chdir(base_path)
    tangoScores = []
    if detailed_output:
        detailedOutFile.write('Tango: prediction of aggregating regions in unfolded polypeptide chains')
        detailedOutFile.write('Threshold: ' + str(tangoThreshold) + '\n')
        detailedOutFile.write('Values are shown as: beta - turn - helix - aggregation'  + '\n') 
    for p in range(len(sequence)):
        tangoScores.append(0)
    # if verbose:
        #print indent + 'TANGO SEARCH'
        # print indent + 'Threshold: ' + str(tangoThreshold)
    position=0
    for line in outputTango.readlines()[1:len(sequence)+1]:
        #print line.split()[1] 
        beta=float(line.split()[2])
        turn=float(line.split()[3])
        helix=float(line.split()[4])
        aggregation=float(line.split()[5])
        if beta > tangoThreshold or turn > tangoThreshold or helix > tangoThreshold or aggregation > tangoThreshold:
            tangoScores[position] = 1
            if detailed_output:
                detailedOutFile.write('Position ' + str(position) + ' has at least one value above threshold. Values are: \n')
                detailedOutFile.write(str(line.split()[2]) + tab + str(line.split()[3]) +  tab + str(line.split()[4]) +  tab + str(line.split()[5]) +  tab + str(line.split()[6]) + '\n' )
        position += 1
    #print str(beta) + tab + str(turn) + tab + str(helix) + tab + str(aggregation) 
    if verbose:
        print(indent + "RESULTS:")
        #print indent + sequence
        #print indent + ''.join(map(str, tangoScores))	  
        data = [sequence,tangoScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
            print(indent + "|".join(str(word).ljust(col_width) for word in row))
    for x in range(0,len(sequence)):
        if tangoScores[x] > 0:
            positionScores[x] += 1



def chargedSearch(sequence, positionScores,config_params,inputsPath,outputsPath,verbose,detailed_output):
    targetNetCharge=config_params['targetNetCharge']
    chargeScores = []
    #FIRST EVALUATE THE NET CHARGE OF SEQUENCE
    netCharge=0
    for p in range(len(sequence)):
        if (sequence[p]=='K') or (sequence[p]=='R') or (sequence[p]=='H'):
            #IF POSITIVELY CHARGED
            netCharge+=1
        else:
            if (sequence[p]=='E') or (sequence[p]=='D'):
                #IF NEGATIVELY CHARGED
                netCharge-=1
    #SET SCORE VALUES BASED ON NET-CHARGE IMPULSE
    if netCharge > targetNetCharge:
        #AIMING FOR A MORE NEGATIVE NET CHARGE
        for p in range(len(sequence)):
            if (sequence[p]=='K') or (sequence[p]=='R') or (sequence[p]=='H'):
                #POSITIVELY CHARGED AA
                chargeScores.append(2)
            else:
                if (sequence[p]=='E') or (sequence[p]=='D'):
                    #IF NEGATIVELY CHARGED
                    chargeScores.append(0)
                else:
                    #NEUTRAL AA
                    chargeScores.append(1)
    else:
        if netCharge < targetNetCharge:
        #AIMING FOR A MORE POSITIVE NET CHARGE
            for p in range(len(sequence)):
                if (sequence[p]=='K') or (sequence[p]=='R') or (sequence[p]=='H'):
                    chargeScores.append(0)
                else:
                    if (sequence[p]=='E') or (sequence[p]=='D'):
                        #IF NEGATIVELY CHARGED
                        chargeScores.append(2)
                    else:
                        #NEUTRAL AA
                        chargeScores.append(1)
        else:
            #THE NET CHARGE IS CORRECT
            for p in range(len(sequence)):
                chargeScores.append(0)
    if verbose:
        #print endl
        print(indent + "Charge search RESULTS:")
        #print indent + sequence
        #print indent + ''.join(map(str, chargeScores))
        data = [sequence,chargeScores]
        col_width = max(len(str(word)) for row in data for word in row)   # padding
        for row in data:
           print(indent + "|".join(str(word).ljust(col_width) for word in row))
    ##ADD hits to global score
    for i in range(len(sequence)):
        positionScores[i]+=chargeScores[i]




def blastIt(sequence, positionScores, database, inputsPath,verbose, detailed_output):
        global match
        ##BLAST SEARCH
        inputBlast=inputsPath+"inputBlast"
        outputBlast=outputsPath+"outputBlast"
        if blastWeb:       # WEB BLAST SEARCH
            if verbose:
                print(indent + "WEB BLAST SEARCH IN PROGRESS...")
            result = NCBIWWW.qblast("blastp", database , sequence)
            records = NCBIXML.parse(result)
            first = next(records)
        else:     # LOCAL BLAST SEARCH
            if verbose:
                print(indent + "LOCAL BLAST SEARCH IN PROGRESS...")
            input=open(inputBlast, 'w')
            input.write(sequence)
            input.close()
            commandLine=NcbiblastpCommandline(query=inputBlast, db=database, evalue=0.001, outfmt=5, out=outputBlast)
            #print commandLine
            stdout, stderr = commandLine()
            result_handle = open(outputBlast)
            blast_records = NCBIXML.parse(result_handle)
            first = next(blast_records)
        if detailed_output:
            detailedOutFile.write('BLAST search against   \n')
            detailedOutFile.write('e-value cutoff: ' + str(cutoff)+ '\n')
            detailedOutFile.write('Database: Uniprot/Swissprot\n')
            detailedOutFile.write('Hits are shown as: E-value - match - subject - query start - query end\n')
        #first.alignments contains all de alignments found
        if len(first.alignments) > 0:
        #get first alignment
            firstAlign=first.alignments[0]
            #print endl
            #print alignment stats 
            if verbose:
                print(indent +"Cutoff:" + str(cutoff))
            for hsp in firstAlign.hsps:
                if hsp.expect < cutoff:
                    match=True   #we have a match
                    if verbose:
                        print(indent + "****Alignment****")
                        print(indent + "Sequence name:", firstAlign.title)
                    #length of the alignment (could be shorter than full sequence)
                    length=firstAlign.length
                    #starting position of alignment in the sequence
                    start=hsp.query_start
                    #ending position of the alignment in the sequence
                    end=hsp.query_end
                    #length = (end-start) ???
                    if detailed_output:
                        detailedOutFile.write(str(hsp.expect) + tab + str(hsp.match) + tab +str(hsp.sbjct) + tab + str(hsp.query_start) + tab+str(hsp.query_end) + '\n')
                    if verbose:
                        print(indent + "E-Value:     " + str(hsp.expect))
                        print(indent + "Query:       " + hsp.query) 
                        print(indent + "Match:       " + hsp.match)
                        print(indent + "Subject:     " + hsp.sbjct) 
                        print(indent + "Query Length:", len(sequence))
                        print(indent + "Query Start: ", hsp.query_start)
                        print(indent + "Query end:   ", hsp.query_end)
            else:
                if verbose:
                    print(indent + "No hits found")
                match=False
        else:
            if verbose:
                print(indent + "No hits found")
            match=False

        if detailed_output:
            if not match:
               	detailedOutFile.write('NO hits found\n') 
        blastScores=[]
        for p in range(len(sequence)):
            blastScores.append(0)
        if match:
            for j in range(len(sequence)):
                if j< (start-1) or j > (end-1):    
                    blastScores[j]+=1
                    #print sequence[j]
                    positionScores[j]+=1
                else:
                    if hsp.match[j-start+1] != "+" and hsp.match[j-start+1] != " ":
                        positionScores[j] += 1
                        blastScores[j]+=1
        if verbose:
            #print endl
            print(indent + "BLAST RESULTS:")
            #print indent + sequence
            #print indent + ''.join(map(str, positionScores))
            data = [sequence,blastScores]
            col_width = max(len(str(word)) for row in data for word in row)   # padding
            for row in data:
                print(indent + "|".join(str(word).ljust(col_width) for word in row))



# should match the names in the execution_set
# {'Tango','Pasta','Waltz','ELM','Prosite','Limbo','Tmhmm','Iupred','Anchor','Amyloid Pattern'
tool_functions_dict={'ELM':elmSearch,
                     'IUpred':iupred,
                     'Tango':tangoSearch,
                     'Pasta':pastaSearch,
                     'Waltz':waltzSearch,
                     'Prosite':prositeSearch,
                     'Limbo':limboEval,
                     'Tmhmm':tmhmmEval,
                     'Anchor':anchor,
                     'Amyloid Pattern':amyloidPatternSearch,
                     'Net charge':chargedSearch
                    }
