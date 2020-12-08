#!/usr/bin/perl  
#

# 
#-----------------------------------------------------------------------------
#------------------------------------------------------------------------------
#
#   PastaAll.pl   : Version 1.0
#
#   Description  : Executes Pasta (Aggregation) using the protein  protein binary (pasta_2013)

#   Author       : Ian Walsh <ian.walsh@bio.unipd.it>
#
#   Date         : Nov. 2013


#------------------------------------------------------------------------------------

#$curdir = "...."; # this path used to be hardcoded in PASTA exe... changed it to a parameter at the end of the command call
$pastabin = "pasta_64";

$date = localtime time;
print "$date\n";


if (scalar(@ARGV)!=7) {
    print "Usage: ./PastaPairs.pl [potential_file] [fasta_dir] [top_pairs] [graphics:1/0] [all/self/fasta_header] [energy cut-off] [pasta_exe_dir]\n";
    print "See README file for examples\n";
    exit;
}

#pasta options
$pastaPot = shift @ARGV; # potential matrix
#print "potential matrix : $pastaPot \n";
$seqdir = shift @ARGV; # sequence file (read directory to find this)
#print "sequence directory : $seqdir \n";

$Npair = shift @ARGV; # number of pairings
#print "number of pairings : $Npair \n";


$workdir = $seqdir;
chomp($workdir);

$smallscale = shift @ARGV;
chomp($smallscale);
if ($smallscale==1) {
#    print "TURNING OFF graphics and matrix calculations\n";
}



opendir(DIR, "$workdir");
@files = grep(/\.fasta$/,readdir(DIR));
closedir(DIR);
#print "workdir : $workdir \n";


$oneallid = shift @ARGV;

$energy = shift @ARGV;
chomp($energy);
open(fi, ">$workdir/energy");
print fi "$energy";
close fi;

$curdir = shift @ARGV;   # add an extra parameter at the end to define the curdir (otherwise I need to hardcode it)


#system("mkdir $workdir/graphs");
#system("mkdir $workdir/data");

$junk = "";

if ($oneallid eq "all") {

	print "Doing $oneallid - against - all protein to protein comparison\n";
	%done = {};
	foreach $file (@files) {

		$fname = "$workdir/$file";
		chomp($fname);
		print "$fname\n";

		open (fi, "<$fname");
		@text = <fi>;
		close fi;
		$name = shift @text;
		$name =~s/>//g;
		$name =~s/\s//g;
		$seq = "";
		while(@text){ 
	        	$seq  .= shift @text;
		        chomp  $seq;
		}
		$seq =~ y/BOJUZ/CXXXX/;
	
		if (length($name)>20) {$name = substr($name,0,20);$name.="\n";}
	
		open(fi2,">$fname.seq");
		print fi2 "$seq\n";
		close fi2;
	    
	    
	            opendir(DIR, "$workdir");
	            @files2 = grep(/\.fasta$/,readdir(DIR));
	            closedir(DIR);
	            foreach $file2 (@files2) {
	                $fname2 = "$workdir/$file2";
	                chomp($fname2);

                        
                        if ($fname eq $fname2) { next; }
			print "Doing $fname --- $fname2 \n";

	                if(!($fname eq $fname2)) {
	                    if ($done{"$fname"."$fname2"}==1 || $done{"$fname2"."$fname"}==1) { next; }
	                }

	                $done{"$fname"."$fname2"} = 1;
	                $done{"$fname2"."$fname"} = 1;
	
	                #print "$fname2\n";
	                $done{$fname2} = 1;
	
	                open (fi, "<$fname2");
	                @text2 = <fi>;
	                close fi;
	                $name2 = shift @text2;
	                $name2 =~s/>//g;
	                $name2 =~s/\s//g;
	                $seq2 = "";
	                while(@text2){
	                    $seq2  .= shift @text2;
	                    chomp  $seq2;
	                }
	                $seq2 =~ y/BOJUZ/CXXXX/;
	
	                open (ft, ">$fname2.seq");
	                print ft "$seq2";
	                close ft;
	
	                $len2 = length($seq2);
	                $len = length($seq);
	                if($len2 < $len) {
	                    $len = $len2;
	                }
	               
	                
	                $start = rindex($fname2, '/');
	                $pair2 = substr($fname2, $start+1, length($fname2));		
			#print "the second file basename (start=$start): $pair2\n";
	
	                $start = rindex($fname, '/');
	                $pair1 = substr($fname, $start+1, length($fname));
			#print "the first file basename (start=$start): $pair1\n";
	                
	                $pair1 =~ s/\.fasta//g;
	                $pair2 =~ s/\.fasta//g;
	
	                #system("$curdir/pasta $fname.seq $fname2.seq 4 100 $Npair 1");
		
	
			#print "\nTRYING: pasta_exe potential sequence_1 sequence_1 profile_1 free_energy_1 profile_2 free_energy_2 prob_matrix free_matrix best_pairings out_seq_1 out_seq_2 LMIN LMAX top_pairs MATRIX_CALC small_scale\n";
	    	    	#print "\n\nTRYING: $curdir/$pastabin $pastaPot $fname.seq $fname2.seq $workdir/$pair1-$pair2.aggr_profile1.pair.dat $workdir/$pair1-$pair2.free_energy1.dat.pair.dat $workdir/$pair1-$pair2.aggr_profile2.pair.dat $workdir/$pair1-$pair2.free_energy2.dat.pair.dat $workdir/$pair1-$pair2.pairing_mat.pair.dat $workdir/$pair1-$pair2.pairing_free_energy.pair.dat $workdir/$pair1-$pair2.best_pairings_list.pair.dat $fname.nseq1 $fname2.nseq2 4 100 $Npair $smallscalen\n";
	
			system("$curdir/$pastabin $pastaPot $fname.seq $fname2.seq $workdir/$pair1-$pair2.aggr_profile1.pair.dat $workdir/$pair1-$pair2.free_energy1.dat.pair.dat $workdir/$pair1-$pair2.aggr_profile2.pair.dat $workdir/$pair1-$pair2.free_energy2.dat.pair.dat $workdir/$pair1-$pair2.pairing_mat.pair.dat $workdir/$pair1-$pair2.pairing_free_energy.pair.dat $workdir/$pair1-$pair2.best_pairings_list.pair.dat $fname.seq.nseq1 $fname2.seq.nseq2 4 100 $Npair $smallscale");	    					

	                #exit;
			if ($smallscale!=0) {
				#print "Calculating R scripts with: Rscript coAggre.R $pair1 $pair2 $workdir....\n";
				system("Rscript coAggre.R $pair1 $pair2 $workdir");
				system("mv $workdir/*.png $workdir/*.pdf $workdir/graphs");
				#print "FINISHED R scripts : Rscript coAggre.R $pair1 $pair2 $workdir....\n";
			}
			#system("mv $workdir/*.dat $workdir/data");			
	            }
        
	}
} elsif ($oneallid eq "self") {

	# self aggregation only allowed
	print "Doing $oneallid  comparisons only\n";


	%done = {};
	foreach $file (@files) {

		$fname = "$workdir/$file";
		chomp($fname);
		#print "$fname\n";

		open (fi, "<$fname");
		@text = <fi>;
		close fi;
		$name = shift @text;
		$name =~s/>//g;
		$name =~s/\s//g;
		$seq = "";
		while(@text){ 
	        	$seq  .= shift @text;
		        chomp  $seq;
		}
		$seq =~ y/BOJUZ/CXXXX/;
	
		if (length($name)>20) {$name = substr($name,0,20);$name.="\n";}
	
		open(fi2,">$fname.seq");
		print fi2 "$seq\n";
		close fi2;
	    
	    
	            opendir(DIR, "$workdir");
	            @files2 = grep(/\.fasta$/,readdir(DIR));
	            closedir(DIR);
	            foreach $file2 (@files2) {
	                $fname2 = "$workdir/$file2";
	                chomp($fname2);

                        
                        if (!($fname eq $fname2)) { next; }

	                if(!($fname eq $fname2)) {
	                    if ($done{"$fname"."$fname2"}==1 || $done{"$fname2"."$fname"}==1) { next; }
	                }

			print "Doing $fname --- $fname2 \n";
	                $done{"$fname"."$fname2"} = 1;
	                $done{"$fname2"."$fname"} = 1;
	
	                #print "$fname2\n";
	                $done{$fname2} = 1;
	
	                open (fi, "<$fname2");
	                @text2 = <fi>;
	                close fi;
	                $name2 = shift @text2;
	                $name2 =~s/>//g;
	                $name2 =~s/\s//g;
	                $seq2 = "";
	                while(@text2){
	                    $seq2  .= shift @text2;
	                    chomp  $seq2;
	                }
	                $seq2 =~ y/BOJUZ/CXXXX/;
	
	                open (ft, ">$fname2.seq");
	                print ft "$seq2";
	                close ft;
	
	                $len2 = length($seq2);
	                $len = length($seq);
	                if($len2 < $len) {
	                    $len = $len2;
	                }
	               
	                
	                $start = rindex($fname2, '/');
	                $pair2 = substr($fname2, $start+1, length($fname2));		
			#print "the second file basename (start=$start): $pair2\n";
	
	                $start = rindex($fname, '/');
	                $pair1 = substr($fname, $start+1, length($fname));
			#print "the first file basename (start=$start): $pair1\n";
	                
	                $pair1 =~ s/\.fasta//g;
	                $pair2 =~ s/\.fasta//g;
	
	                #system("$curdir/pasta $fname.seq $fname2.seq 4 100 $Npair 1");
		
	
			#print "\nTRYING: pasta_exe potential sequence_1 sequence_1 profile_1 free_energy_1 profile_2 free_energy_2 prob_matrix free_matrix best_pairings out_seq_1 out_seq_2 LMIN LMAX top_pairs MATRIX_CALC small_scale\n";
	    	    	#print "\n\nTRYING: $curdir/$pastabin $pastaPot $fname.seq $fname2.seq $workdir/$pair1-$pair2.aggr_profile1.pair.dat $workdir/$pair1-$pair2.free_energy1.dat.pair.dat $workdir/$pair1-$pair2.aggr_profile2.pair.dat $workdir/$pair1-$pair2.free_energy2.dat.pair.dat $workdir/$pair1-$pair2.pairing_mat.pair.dat $workdir/$pair1-$pair2.pairing_free_energy.pair.dat $workdir/$pair1-$pair2.best_pairings_list.pair.dat $fname.nseq1 $fname2.nseq2 4 100 $Npair $smallscalen\n";
	
			system("$curdir/$pastabin $pastaPot $fname.seq $fname2.seq $workdir/$pair1-$pair2.aggr_profile1.pair.dat $workdir/$pair1-$pair2.free_energy1.dat.pair.dat $workdir/$pair1-$pair2.aggr_profile2.pair.dat $workdir/$pair1-$pair2.free_energy2.dat.pair.dat $workdir/$pair1-$pair2.pairing_mat.pair.dat $workdir/$pair1-$pair2.pairing_free_energy.pair.dat $workdir/$pair1-$pair2.best_pairings_list.pair.dat $fname.seq.nseq1 $fname2.seq.nseq2 4 100 $Npair $smallscale");	    					

	                #exit;
			if ($smallscale!=0) {
				#print "Calculating R scripts with: Rscript coAggre.R $pair1 $pair2 $workdir....\n";
				system("Rscript coAggre.R $pair1 $pair2 $workdir");
				system("mv $workdir/*.png $workdir/*.pdf $workdir/graphs");
				#print "FINISHED R scripts : Rscript coAggre.R $pair1 $pair2 $workdir....\n";
			}
			#system("mv $workdir/*.dat $workdir/data");			
	            }
        
	}	

} else {
	# one id picked to aggregate against the rest

	%done = {};
	
	print "Doing $oneallid - against - all protein to protein comparison\n";

	$fname = "$workdir/$oneallid.fasta";
	chomp($fname);
	#print "$fname\n";

	open (fi, "<$fname");
	@text = <fi>;
	close fi;
	$name = shift @text;
	$name =~s/>//g;
	$name =~s/\s//g;
	$seq = "";
	while(@text){ 
        	$seq  .= shift @text;
	        chomp  $seq;
	}
	$seq =~ y/BOJUZ/CXXXX/;

	if (length($name)>20) {$name = substr($name,0,20);$name.="\n";}

	open(fi2,">$fname.seq");
	print fi2 "$seq\n";
	close fi2;
    
    
            opendir(DIR, "$workdir");
            @files2 = grep(/\.fasta$/,readdir(DIR));
            closedir(DIR);
            foreach $file2 (@files2) {
                $fname2 = "$workdir/$file2";
                chomp($fname2);

               
                if ($fname eq $fname2) { next; }
		
		print "Doing $fname --- $fname2 \n";
                if(!($fname eq $fname2)) {
                    if ($done{"$fname"."$fname2"}==1 || $done{"$fname2"."$fname"}==1) { next; }
                }
                $done{"$fname"."$fname2"} = 1;
                $done{"$fname2"."$fname"} = 1;

                #print "$fname2\n";
                $done{$fname2} = 1;

                open (fi, "<$fname2");
                @text2 = <fi>;
                close fi;
                $name2 = shift @text2;
                $name2 =~s/>//g;
                $name2 =~s/\s//g;
                $seq2 = "";
                while(@text2){
                    $seq2  .= shift @text2;
                    chomp  $seq2;
                }
                $seq2 =~ y/BOJUZ/CXXXX/;

                open (ft, ">$fname2.seq");
                print ft "$seq2";
                close ft;

                $len2 = length($seq2);
                $len = length($seq);
                if($len2 < $len) {
                    $len = $len2;
                }
               
                
                $start = rindex($fname2, '/');
                $pair2 = substr($fname2, $start+1, length($fname2));		
		#print "the second file basename (start=$start): $pair2\n";

                $start = rindex($fname, '/');
                $pair1 = substr($fname, $start+1, length($fname));
		#print "the first file basename (start=$start): $pair1\n";
                
                $pair1 =~ s/\.fasta//g;
                $pair2 =~ s/\.fasta//g;

                #system("$curdir/pasta $fname.seq $fname2.seq 4 100 $Npair 1");
	

		#print "\nTRYING: pasta_exe potential sequence_1 sequence_1 profile_1 free_energy_1 profile_2 free_energy_2 prob_matrix free_matrix best_pairings out_seq_1 out_seq_2 LMIN LMAX top_pairs MATRIX_CALC small_scale\n";
    	    	#print "\n\nTRYING: $curdir/$pastabin $pastaPot $fname.seq $fname2.seq $workdir/$pair1-$pair2.aggr_profile1.pair.dat $workdir/$pair1-$pair2.free_energy1.dat.pair.dat $workdir/$pair1-$pair2.aggr_profile2.pair.dat $workdir/$pair1-$pair2.free_energy2.dat.pair.dat $workdir/$pair1-$pair2.pairing_mat.pair.dat $workdir/$pair1-$pair2.pairing_free_energy.pair.dat $workdir/$pair1-$pair2.best_pairings_list.pair.dat $fname.nseq1 $fname2.nseq2 4 100 $Npair $smallscalen\n";

		system("$curdir/$pastabin $pastaPot $fname.seq $fname2.seq $workdir/$pair1-$pair2.aggr_profile1.pair.dat $workdir/$pair1-$pair2.free_energy1.dat.pair.dat $workdir/$pair1-$pair2.aggr_profile2.pair.dat $workdir/$pair1-$pair2.free_energy2.dat.pair.dat $workdir/$pair1-$pair2.pairing_mat.pair.dat $workdir/$pair1-$pair2.pairing_free_energy.pair.dat $workdir/$pair1-$pair2.best_pairings_list.pair.dat $fname.seq.nseq1 $fname2.seq.nseq2 4 100 $Npair $smallscale");                    

		if ($smallscale!=0) {
			#print "Calculating R scripts with: Rscript coAggre.R $pair1 $pair2 $workdir....\n";
			system("Rscript coAggre.R $pair1 $pair2 $workdir");
			system("mv $workdir/*.png $workdir/*.pdf $workdir/graphs");
			#print "FINISHED R scripts : Rscript coAggre.R $pair1 $pair2 $workdir....\n";               
		}
		#system("mv $workdir/*.dat $workdir/data");

            }

}

#clean up
system("rm $workdir/*.seq $workdir/*.nseq* $workdir/energy ");

$date = localtime time;
print "\n$date";
