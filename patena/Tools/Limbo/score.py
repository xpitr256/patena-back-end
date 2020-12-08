#!/usr/bin/python3
# ======================================================================
# Script that reads a fasta file, matrix and scores them with output ===
# ======================================================================

# =========================================
# Written by Joost Van Durme, SWITCH Lab ==
# =========================================

# to run >> python score.py matrix.mat sequences.fasta
# ====================================================

# imports
# =======

import string,sys,operator,math

# Most important thing to customize: the score THRESHOLD
# ======================================================

threshold = 11.08

# Normally no changes are required below this point
# =================================================

matrix,fasta = open(sys.argv[1],'r').readlines(),open(sys.argv[2],'r').readlines()
aas = ['A','C','D','E','F','G','H','I','K','L','M','N','P','Q','R','S','T','V','W','Y']
T = 312
R = 0.001987
maxresultsfile = sys.argv[2]+'_maxscores.txt'
averageresultsfile = sys.argv[2]+'_averagescores.txt'
allresultsfile = sys.argv[2]+'_allscores.txt'
#bindersresultsfile = sys.argv[2]+'_binders.txt'
bindersresultsfile= sys.argv[3]
multisitefile = sys.argv[2]+'_multisite.txt'

# readfasta
# =========

def readfasta(fastafile):
	seqs = []
	newseq = 0
	sequence = ''

	for j in range(len(fastafile)):
		
		# encounter a new sequence or detect the last line in the fasta file
		# ==================================================================

		if fastafile[j][0] == '>' or j == len(fastafile)-1: 

			# for the first sequence in the file
			# ==================================

			if newseq == 0:
				seqname = fastafile[j][1:].replace('\n','') #string.replace(fastafile[j][1:],'\n','')
				seqname = seqname.replace('\r','') #string.replace(seqname,'\r','')
				newseq = 1

			# encounter the next sequence in the fasta file
			# =============================================

			elif newseq == 1:
				if j == len(fastafile)-1: # be sure to include the last line in the fasta file
					strippedseq = fastafile[j].replace('\n','') #string.replace(fastafile[j],'\n','')
					strippedseq = strippedseq.replace('\r','') #string.replace(strippedseq,'\r','')
					sequence = sequence + strippedseq
				seqs.append([seqname,sequence])
				seqname = fastafile[j][1:].replace('\n','') #string.replace(fastafile[j][1:],'\n','')
				seqname = seqname.replace('\r','') #string.replace(seqname,'\r','')
				seqname = seqname.replace("|",'_') #string.replace(seqname,"|",'_')
				seqname = seqname.replace("/",'_') #string.replace(seqname,"/",'_')
				seqname = seqname.replace("\\",'_') #string.replace(seqname,"\\",'_')
				sequence = ''

		# read and merge the sequence lines for each sequence
		# ===================================================

		else:
			strippedseq = fastafile[j].replace('\n','') #string.replace(fastafile[j],'\n','')
			strippedseq = strippedseq.replace('\r','') #string.replace(strippedseq,'\r','')
			sequence = sequence + strippedseq

		# now we have the list seqs. It contain tuples with sequence name as first part and sequence as secons part [['name','sequence'],[...,...]]

	return seqs

# readmatrix
# ==========

def readmatrix(matrix):
	matrixscores = []
	peptide_length = 0
	pos = 0
	for i in range(len(matrix)):
		if matrix[i][0] != '#':
			peptide_length = peptide_length + 1
			scores = matrix[i].split('\t') #string.split(matrix[i],'\t')
			matrixscores.append({})
			j = 0
			for aa in aas:
				matrixscores[pos][aa] = scores[j+1]
				j = j + 1
			pos = pos + 1
	return peptide_length,matrixscores

	# matrixscores is a list of dictionnaries, like [{'A':-0.09,'C':-3.30,...},{....},{....},{....},{....},{....},{....}]
	# each dict is a line of scores per position, so the number of dicts equals the peptidelength
	# note that the AA order is not really alphabetically in the dicts, but that's ok

# for each sequence, do a scoring and store the score in a list with sequence, position, score and name
# =====================================================================================================

def score(fastafile,matrixscores,peptide_length):

	maxseqs = []
	averageseqs = []
	allallseqs = []
	allboltz = []

	for line in fastafile:

		# get the protein name
		# ====================

		name = line[0]

		# get the sequence
		# ================

		sequence = line[1]

		if 'B' not in sequence and 'J' not in sequence and 'O' not in sequence and 'U' not in sequence and 'X' not in sequence and 'Z' not in sequence and len(sequence) >= 7:

			allseqs = []
			allprob = []
			allpartfu = []
			boltz = []
		
			# get every possible heptapeptide for each sequence by sliding a hepta window over it
			# ===================================================================================

			#print 'Scoring sequence ',name

			for i in range(len(sequence)-peptide_length+1):
				heptaseq = sequence[i:i+peptide_length]
			
				# score this heptapeptide
				# =======================

				scores = []
				for j in range(peptide_length):
					scores.append(float(matrixscores[j][heptaseq[j]]))
				totalscore = sum(scores)
				position = str(i+1)
				#print heptaseq+'\t'+position+'\t'+str(totalscore)+'\t'+name

				# create a list of the different scores for each fasta entry to extract the highest binder
				# ========================================================================================

				allseqs.append([heptaseq,position,totalscore,name])
				allallseqs.append([heptaseq,position,totalscore,name])

				# create a list of all Boltzmann partition functions for all heptapeptides
				# ========================================================================

				partfu = math.exp(totalscore/(R*T))
				allpartfu.append([heptaseq,position,partfu,name])
			
			# put the highest binder of a set in a list (maxseqs)
			# ===================================================

			maxseq = allseqs[0]
			for currentseq in allseqs:
				if currentseq[2] > maxseq[2]:
					maxseq = currentseq
			maxseqs.append(maxseq)

			# calculate the average score for every peptide
			# =============================================

			scorelist = []
			for currentseq in allseqs:
				scorelist.append(float(currentseq[2]))
			averagescore = sum(scorelist)/len(scorelist)
			averageseqs.append([sequence,'1',averagescore,name])

			# calculate the global Boltzmann partition function for one protein sequence
			# ==========================================================================

			Q = 0
			for i in allpartfu:
				Q = Q + i[2]
			
			# calculate the the probability of each heptaseq
			# ==============================================

			for j in allpartfu:
				probability = j[2]/Q
				allprob.append([j[0],j[1],probability,j[3]])

			# calculate the Boltzmann probability of every residue in the protein sequence
			# ============================================================================
			
			for k in range(len(sequence)):
				totprob = 0
				residue = sequence[k]
				residuenumber = str(k+1)
				# the first 6 residues do not reside in exactly 7 windows
				if k < peptide_length-1:
					for r in range(k+1):
						probability = allprob[r][2]
						totprob = totprob + probability
				# the last 6 residues do not reside in exactly 7 windows
				elif k > len(sequence)-peptide_length:
					for r in range(len(sequence)-k):
						probability = allprob[k-peptide_length + 1 + r][2]
						totprob = totprob + probability
				else:
					for r in range(peptide_length):
						probability = allprob[k-peptide_length + 1 + r][2]
						totprob = totprob + probability
				boltz.append([residue,residuenumber,totprob])
			allboltz.append([name,boltz])

			# CODE TO FIND MULTIBINDINGSITE #
			# ============================= #
			# ============================= #

			# find overlapping hepta's to identify true DnaK site
			# ===================================================

			highspec_heptas = []
			other_heptas = []

			# put all high specificity hepta's in a list
			# ==========================================

			for hit in allseqs:
				if hit[2] >= threshold:
					highspec_heptas.append(hit)
				else:
					other_heptas.append(hit)

			# make a dictionnary for peptides that overlap with each other and put those in the same key
			# ==========================================================================================

			diction = {}
			x = 1
			done = 0
			highspec_heptas_reduced = highspec_heptas[1:]
			# loop over all high_specificity hepta's
			for hepta in highspec_heptas:
				# only make a new key for this hepta when it is not yet somewhere in the dictionnary
				for key in list(diction.keys()):
					if hepta in diction[key]:
						done = 1
					else:
						done = 0
				# if not present, make new key
				if done == 0:
					diction[x] = [hepta]
				# now see if the rest of the high spec hepta's overlap with this one
				for hepta2 in highspec_heptas_reduced:
					# minimum overlap of 6 residues (7-6 = 1)
					if int(hepta2[1]) <= int(hepta[1])+1:
						# if there is an overlap, put this hepta in the same dict key as the one it is compared to, but make sure we are not duplicating
						for key in list(diction.keys()):
							if hepta in diction[key] and hepta2 not in diction[key]:
								diction[key].append(hepta2)
				# remove the hepta that was just checked and reduce the hepta high spec list by 1 for the inner loop array
				highspec_heptas_reduced = highspec_heptas_reduced[1:]
				x = x + 1
			# open a results and pos array
			results = []
			# check the range of each region
			for key in list(diction.keys()):
				pos = []                     #heptaseq,position,totalscore,name
				# if we have overlapping heptapeptides
				if len(diction[key]) > 1:
					for arr in diction[key]:
						pos.append(int(arr[1]))
					maximum = max(pos)
					minimum = min(pos)
					totalscore = 0
					# loop over the overlapping peptides and calculate the total score
					for i in range(minimum,maximum+1):
						for seq in allseqs:
							if seq[1] == str(i):
								totalscore = totalscore + seq[2]
					results.append([sequence[minimum-1:maximum+6],str(minimum)+'-'+str(maximum+6),totalscore,name])
				# if there is only 1 heptapeptide for this range (normal situation)
				else:
					results.append([diction[key][0][0],diction[key][0][1]+'-'+str(int(diction[key][0][1])+6),diction[key][0][2],diction[key][0][3]])
			# put the weighted score in the results
			newresults = []
			if results != []:
				for result in results:
					score = str(round(result[2],2))
					#weighted = str(round(result[2]/len(result[0]),2))
					newresults.append([result[0],result[1],result[2],result[3]])
			# and sort the results in ascending order
			results = sorted(newresults, key=operator.itemgetter(2))
			# and reverse, sigh ...
			results.reverse()

		# END OF MULTIBINDINGSITE CODE #
		# ============================ #
		# ============================ #

		# handle sequences shorter than 7
		# ===============================

		elif len(sequence)<7:

			shortscores = []

			# define the number of possible scores (eg. a 5-mer can have 3 different scores with a hepta PSSM, a 6-mer has 2, ...)
			# ====================================================================================================================

			for i in range(-1*(len(sequence)-peptide_length-1)):
				scores = []
				for j in range(len(sequence)):

					# do i+j to start at the next position in the PSSM for the different possible scores
					# ==================================================================================

					scores.append(float(matrixscores[i+j][sequence[j]]))
				totalscore = sum(scores)
				shortscores.append([sequence,str(i+1),totalscore,name])
			
			# take the best score
			# ===================
			
			maxseq = shortscores[0]
			for currentseq in shortscores:
				if currentseq[2] > maxseq[2]:
					maxseq = currentseq
			maxseqs.append(maxseq)
	
			# and add this sequence to the other lists too, allthough it does not contain useful information
			# ==============================================================================================

			averageseqs.append(maxseq)
			allallseqs.append(maxseq)

	return allallseqs,maxseqs,averageseqs,results,allboltz

# write the best binders in a nice tab separated file
# ===================================================

def writescorefile(fastafile,allseqs,maxseqs,averageseqs,multisite,allboltz):

	# write the score of the best heptawindow per sequence to a file
	# ==============================================================

#	print 'writing maxscores.txt'
#	results_max = open(maxresultsfile,'w')#heptaseq,position,totalscore,name
#	for hit in maxseqs:
#		results_max.write(hit[0]+'\t'+hit[1]+'\t'+str(hit[2])+'\t'+hit[3]+'\n')
#	results_max.close()
#
#	# write the score of the all heptawindows per sequence to a file
#	# ==============================================================
#
#	print 'writing allscores.txt'
#	results = open(allresultsfile,'w')
#	for hit in allseqs:
#			results.write(hit[0]+'\t'+hit[1]+'\t'+str(hit[2])+'\t'+hit[3]+'\n')
#	results.close()
#
	# write the predicted binders to a file
	# =====================================

	#print 'writing binders.txt'
	results = open(bindersresultsfile,'w')
	for hit in allseqs:
		if hit[2] >= threshold:
			results.write(hit[1]+'\t'+hit[0]+'\t'+str(hit[2])+'\t'+hit[3]+'\n')
	results.close()

	# write multibinding site information to a file
	# =============================================

#	print 'writing multisite.txt'
#	if multisite != []:
#		results = open(multisitefile,'w')
#		for hit in multisite:
#			results.write(hit[0]+'\t'+hit[1]+'\t'+str(hit[2])+'\t'+hit[3]+'\n')
#		results.close()
#	else:
#		print 'no binding sites larger than 7 found.'

	# write the Boltzmann probability per residue file
	# ================================================

#	print 'writing Boltzmann probability per residue to file'
#	for fasta in fastafile:
#		results = open(fasta[0][0:20]+'_boltzmann.txt','w')
#		for hit in allboltz:
#			for prob in hit[1]:
#				results.write(hit[0]+'\t'+prob[0]+'\t'+prob[1]+'\t'+str(prob[2])+'\n')
#		results.close()

	#print 'Maximum scores per protein written to \'maxscores.txt\'.'
	#print 'All heptapeptide scores written to \'allscores.txt\'.'
	#print 'All predicted binders (above threshold) written to \'binders.txt\'.'
	#print 'Multisite information written to \'multisite.txt\'.'

	# write the score of the all heptawindows per protein sequence tabulated to a file
	# ================================================================================

	# split the allseqs by protein (fasta entry)
	# ==========================================

	#print 'working on nicetable'
	#newallseqs = []
	#x = 0
	#for fasta in fastafile:
	#	if len(fasta[1]) >= 7:
	#		newallseqs.append([])
	#		for seq in allseqs:
	#			if seq[3] == fasta[0]:
	#				newallseqs[x].append(seq)
	#		x = x + 1

	#print 'writing nicetable.txt'
	#results = open('nicetable.txt','w')
	#for allseqs in newallseqs:
	#	results.write(allseqs[0][0]+'\t')
	#	for hit in allseqs:
	#		results.write(str(hit[2])+'\t')
	#	results.write('\n')
	#results.close()

	#print 'writing nicertable.txt'
	#results = open('nicertable.txt','w')
	#for allseqs in newallseqs:
	#	results.write(allseqs[0][0]+'\t')
	#results.write('\n')
	#for i in range(3000):
	#	for allseqs in newallseqs:
	#		try:
	#			results.write(str(allseqs[i][2])+'\t')
	#		except IndexError:
	#			results.write('\t')
	#	results.write('\n')
	#results.close()

	# uncomment the lines below to write average score for each full sequence to a separate file
	# ==========================================================================================

	#results_average = open(averageresultsfile,'w')
	#for hit in averageseqs:
	#	results_average.write(hit[0]+'\t'+hit[1]+'\t'+str(hit[2])+'\t'+hit[3]+'\n')
	#results_average.close()

	#print 'Output written to \'averagescores.txt\'.'

# main program
# ============

fastafile = readfasta(fasta)
peptide_length,matrixscores = readmatrix(matrix)
allseqs,maxseqs,averageseqs,multisite,allboltz = score(fastafile,matrixscores,peptide_length)
writescorefile(fastafile,allseqs,maxseqs,averageseqs,multisite,allboltz)


