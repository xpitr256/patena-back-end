#! /usr/bin/perl -w

use strict;

my ($fastafile,$matfile,$outopt,$thresh) = @ARGV; # tobepredicted.fasta mymatrix.mat [best/all/full/opp] [tresh]

my $id;
my $seq = "";
my @seqscore;
my $hits;
my $nseqs = 0;
my $nmots = 0;
my $nhitseqs = 0;
my $nhitmots = 0;
my $cutcharge = 0;
my @mat = readMatrix($matfile);
if (!defined($outopt)) {
  $outopt = "all";
  }
if (!defined($thresh)) {
  $thresh = $mat[$mat[0][0]+1][2];
  }
if ($outopt =~ /_ch/) {
  $cutcharge = 1;
  $outopt =~ s/_ch//;
  }
open (FILE, "$fastafile") || die ("ERROR: readFasta() could not open file $fastafile !!!\n");
while (defined(my $line = <FILE>)) {
  if ($line =~ /^>(\S+)/) {
  #~ if ($line =~ /^>([^\r\n]+)/) {
    if (length($seq) > 3) {
      @seqscore = scoreSeqMat($seq,@mat);
      if ($cutcharge == 1) {
        @seqscore = seqscoreRegex("[DE].*[DE]",-5,$mat[0][0],@seqscore);
        @seqscore = seqscoreRegex("[KRH].*[KRH]",-5,$mat[0][0],@seqscore);
        }
      #~ if (length($seq) > 15) {
      @seqscore = seqscore2ezext($mat[0][0],$thresh,@seqscore);
        #~ }
      $hits = printSeqHits($outopt,$thresh,$id,@seqscore);
      if ($hits > 0) {
        $nhitseqs++;
        }
      $nseqs++;
      $nmots = $nmots + (length($seq)-$mat[0][0]+1);
      $nhitmots = $nhitmots + $hits;
      }
    $id = $1;
    $seq = "";
    }
  if ($line !~ /^>/) {
    $line =~ s/[^A-Za-z\-\.]//g;
    $line = uc($line);
    $seq = $seq.$line;
    }
  } 
close (FILE);
# score/count last entry
@seqscore = scoreSeqMat($seq,@mat);
if ($cutcharge == 1) {
  @seqscore = seqscoreRegex("[DE].*[DE]",-5,$mat[0][0],@seqscore);
  @seqscore = seqscoreRegex("[KRH].*[KRH]",-5,$mat[0][0],@seqscore);
  }
#~ if (length($seq) > 15) {
@seqscore = seqscore2ezext($mat[0][0],$thresh,@seqscore);
  #~ }
$hits = printSeqHits($outopt,$thresh,$id,@seqscore);
if ($hits > 0) {
  $nhitseqs++;
  }
$nseqs++;
$nmots = $nmots + (length($seq)-$mat[0][0]+1);
$nhitmots = $nhitmots + $hits;
#if ($outopt ne 'tango') {
#  print "\n--> input file: $fastafile\n";
#  print "--> matrix file: $matfile\n";
#  print "--> threshhold: $thresh\n";
#  print "--> output option: $outopt\n";
#  printf "--> predicted %d of %d (%.2f%%) motifs in %d of %d (%.2f%%) sequences\n\n",$nhitmots,$nmots,100*$nhitmots/$nmots,$nhitseqs,$nseqs,100*$nhitseqs/$nseqs;
#  }
exit(0);

sub seqscoreRegex {
  my ($myregex,$myscore,$winlen,@myseqscore) = @_;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    my $mymot = substr($myseqscore[0],$mi-1,$winlen);
    while ($mymot =~ /$myregex/g) {
      $myseqscore[$mi] = $myseqscore[$mi] + $myscore;
      }
    }
  return(@myseqscore);
  }

sub seqscore2specscore {
  my (@myseqscore) = @_;
  my %score2spec = ("14.1508",99.66555184,"14.0655",99.33110368,"13.0905",98.99665552,"12.1534",98.66220736,"11.5278",98.3277592,"10.7833",97.99331104,"10.6708",97.65886288,"10.2988",97.32441472,"10.0547",96.98996656,"9.9711",96.65551839,"9.5666",96.32107023,"9.5613",95.98662207,"9.4559",95.65217391,"9.4035",95.31772575,"9.3001",94.98327759,"9.2283",94.64882943,"9.0331",94.31438127,"8.9761",93.97993311,"8.8978",93.64548495,"8.8455",93.31103679,"8.7404",92.97658863,"8.6211",92.64214047,"8.5565",92.30769231,"7.8817",91.97324415,"7.7681",91.63879599,"7.7452",91.30434783,"7.5987",90.96989967,"7.4942",90.63545151,"7.4423",90.30100334,"7.3461",89.96655518,"7.3233",89.63210702,"7.2894",89.29765886,"7.254",88.9632107,"7.2177",88.62876254,"7.0145",88.29431438,"6.8806",87.95986622,"6.7316",87.62541806,"6.3403",87.2909699,"6.0442",86.95652174,"5.8734",86.62207358,"5.8217",86.28762542,"5.7082",85.95317726,"5.6601",85.6187291,"5.5266",85.28428094,"5.482",84.94983278,"5.407",84.61538462,"5.385",84.28093645,"5.3617",83.94648829,"5.3112",83.61204013,"5.2905",83.27759197,"5.1978",82.94314381,"5.0944",82.60869565,"5.0353",82.27424749,"5.0269",81.93979933,"4.9988",81.60535117,"4.9575",81.27090301,"4.8009",80.93645485,"4.5847",80.60200669,"4.1395",80.26755853,"3.4891",79.93311037,"3.4759",79.59866221,"3.4015",79.26421405,"3.3931",78.92976589,"3.3823",78.59531773,"3.3591",78.26086957,"3.3065",77.9264214,"3.3025",77.59197324,"2.9729",77.25752508,"2.9469",76.92307692,"2.9348",76.58862876,"2.786",76.2541806,"2.5591",75.91973244,"2.4953",75.58528428,"2.2175",75.25083612,"2.2076",74.91638796,"2.0625",74.5819398,"1.9955",74.24749164,"1.8171",73.91304348,"1.7865",73.57859532,"1.7481",73.24414716,"1.6719",72.909699,"1.4996",72.57525084,"1.4417",72.24080268,"1.3125",71.90635452,"1.2558",71.57190635,"1.1992",71.23745819,"1.1159",70.90301003,"1.0584",70.56856187,"1.0065",70.23411371,"0.9918",69.89966555,"0.9478",69.56521739,"0.8667",69.23076923,"0.8445",68.89632107,"0.7964",68.56187291,"0.7629",68.22742475,"0.6995",67.89297659,"0.6886",67.55852843,"0.6672",67.22408027,"0.618",66.88963211,"0.5749",66.55518395,"0.4715",66.22073579,"0.4215",65.88628763,"0.4049",65.55183946,"0.3975",65.2173913,"0.2732",64.88294314,"0.2239",64.54849498,"0.1983",64.21404682,"0.1632",63.87959866,"0.1415",63.5451505,"0.0816",63.21070234,"-0.0327",62.87625418,"-0.0598",62.54180602,"-0.0835",62.20735786,"-0.103",61.8729097,"-0.1095",61.53846154,"-0.161",61.20401338,"-0.165",60.86956522,"-0.193",60.53511706,"-0.2536",60.2006689,"-0.3049",59.86622074,"-0.4145",59.53177258,"-0.4676",59.19732441,"-0.4715",58.86287625,"-0.4772",58.52842809,"-0.5854",58.19397993,"-0.5963",57.85953177,"-0.6639",57.52508361,"-0.6646",57.19063545,"-0.7188",56.85618729,"-0.757",56.52173913,"-0.9631",56.18729097,"-0.9942",55.85284281,"-1.0228",55.51839465,"-1.0431",55.18394649,"-1.0503",54.84949833,"-1.158",54.51505017,"-1.1969",54.18060201,"-1.2226",53.84615385,"-1.2307",53.51170569,"-1.234",53.17725753,"-1.2736",52.84280936,"-1.353",52.5083612,"-1.395",52.17391304,"-1.4363",51.83946488,"-1.5107",51.50501672,"-1.5332",51.17056856,"-1.6723",50.8361204,"-1.689",50.50167224,"-1.734",50.16722408,"-1.7883",49.83277592,"-1.7977",49.49832776,"-1.8074",49.1638796,"-1.8141",48.82943144,"-1.8369",48.49498328,"-1.9045",48.16053512,"-1.9095",47.82608696,"-1.9176",47.4916388,"-2.1337",47.15719064,"-2.2198",46.82274247,"-2.2561",46.48829431,"-2.2611",46.15384615,"-2.2822",45.81939799,"-2.4016",45.48494983,"-2.4188",45.15050167,"-2.4362",44.81605351,"-2.5006",44.48160535,"-2.5305",44.14715719,"-2.5587",43.81270903,"-2.6671",43.47826087,"-2.7462",43.14381271,"-2.7734",42.80936455,"-2.7748",42.47491639,"-2.8064",42.14046823,"-2.8767",41.80602007,"-2.9363",41.47157191,"-2.9615",41.13712375,"-3.018",40.80267559,"-3.0523",40.46822742,"-3.064",40.13377926,"-3.1355",39.7993311,"-3.2013",39.46488294,"-3.2289",39.13043478,"-3.2764",38.79598662,"-3.4036",38.46153846,"-3.4147",38.1270903,"-3.4673",37.79264214,"-3.4874",37.45819398,"-3.5548",37.12374582,"-3.5868",36.78929766,"-3.6444",36.4548495,"-3.6935",36.12040134,"-3.7667",35.78595318,"-3.7747",35.45150502,"-3.8131",35.11705686,"-3.8415",34.7826087,"-3.8976",34.44816054,"-3.9576",34.11371237,"-3.9961",33.77926421,"-4.0202",33.44481605,"-4.0217",33.11036789,"-4.058",32.77591973,"-4.1103",32.44147157,"-4.1506",32.10702341,"-4.1578",31.77257525,"-4.2214",31.43812709,"-4.2328",31.10367893,"-4.406",30.76923077,"-4.4177",30.43478261,"-4.4777",30.10033445,"-4.4931",29.76588629,"-4.5166",29.43143813,"-4.6491",29.09698997,"-4.7243",28.76254181,"-4.7345",28.42809365,"-4.8019",28.09364548,"-4.8506",27.75919732,"-4.8725",27.42474916,"-4.8737",27.090301,"-4.9063",26.75585284,"-4.9176",26.42140468,"-4.928",26.08695652,"-5.0142",25.75250836,"-5.0674",25.4180602,"-5.1284",25.08361204,"-5.1731",24.74916388,"-5.2099",24.41471572,"-5.2416",24.08026756,"-5.2728",23.7458194,"-5.3124",23.41137124,"-5.3138",23.07692308,"-5.4067",22.74247492,"-5.4519",22.40802676,"-5.4723",22.0735786,"-5.556",21.73913043,"-5.7443",21.40468227,"-5.8125",21.07023411,"-5.8154",20.73578595,"-5.857",20.40133779,"-5.8708",20.06688963,"-5.9068",19.73244147,"-5.9949",19.39799331,"-6.051",19.06354515,"-6.0842",18.72909699,"-6.1904",18.39464883,"-6.1931",18.06020067,"-6.2688",17.72575251,"-6.3423",17.39130435,"-6.3493",17.05685619,"-6.3986",16.72240803,"-6.4319",16.38795987,"-6.4728",16.05351171,"-6.509",15.71906355,"-6.5624",15.38461538,"-6.6404",15.05016722,"-6.641",14.71571906,"-6.7893",14.3812709,"-6.9158",14.04682274,"-7.0096",13.71237458,"-7.1765",13.37792642,"-7.294",13.04347826,"-7.3162",12.7090301,"-7.4185",12.37458194,"-7.5246",12.04013378,"-7.5658",11.70568562,"-7.6133",11.37123746,"-7.8027",11.0367893,"-7.8454",10.70234114,"-7.8591",10.36789298,"-7.8781",10.03344482,"-7.8859",9.698996656,"-8.1225",9.364548495,"-8.1579",9.030100334,"-8.2752",8.695652174,"-8.4023",8.361204013,"-8.4588",8.026755853,"-8.5243",7.692307692,"-8.6137",7.357859532,"-8.6662",7.023411371,"-8.6841",6.688963211,"-8.9024",6.35451505,"-8.9437",6.02006689,"-9.137",5.685618729,"-9.3506",5.351170569,"-9.3588",5.016722408,"-9.4272",4.682274247,"-9.8864",4.347826087,"-9.9175",4.013377926,"-9.9977",3.678929766,"-10.007",3.344481605,"-10.0413",3.010033445,"-10.1115",2.675585284,"-10.4158",2.341137124,"-10.5028",2.006688963,"-10.5569",1.672240803,"-11.187",1.337792642,"-11.2794",1.003344482,"-13.1053",0.668896321,"-13.2241",0.334448161,"-1000000000",0);
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    my $closest = 0;
    foreach my $s (sort {$a <=> $b} keys %score2spec) {
      if ($myseqscore[$mi] > $s) {
        $closest = $score2spec{$s};
        }
      else {
        last;
        }
      }
    $myseqscore[$mi] = $closest;
    }
  return(@myseqscore);
  }

sub seqscore2ezext {
  my ($winlen,$mythresh,@myseqscore) = @_;
  my $cdo = 0;
  # my $offset = 0;
  #~ ($offset,@myseqscore) = seqscore2setpositiveOFF(@myseqscore);
  #~ $mythresh = $mythresh + $offset;
  #~ my $maxneg = seqscore2min(@myseqscore);
  @myseqscore = seqscore2specscore(@myseqscore);
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myseqscore[$mi] < $mythresh) {
      if ($cdo == 0) {
        $myseqscore[$mi] = 0;
        }
      else {
        $cdo--;
        if ($myseqscore[$mi] > $mythresh-14) {
          $cdo = $winlen-1;
          }
        }
      }
    else {
      $cdo = $winlen-1;
      }
    }
  my $curry = $mythresh;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myseqscore[$mi] >= $mythresh) {
      $curry = $myseqscore[$mi];
      }
    if ($myseqscore[$mi] < $mythresh && $myseqscore[$mi] > 0) {
      $myseqscore[$mi] = $curry;
      }
    }
  #~ @myseqscore = seqscore2norm(100,@myseqscore);
  #~ @myseqscore = seqscore2cutcharge($winlen,@myseqscore);
  @myseqscore = seqscore2cutiso(5,@myseqscore);
  return(@myseqscore);
  }

sub seqscore2cutiso {
  my ($minlen,@myseqscore) = @_;
  my $regc = 0;
  my $regp = 0;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myseqscore[$mi] > 0) {
      if ($regc == 0) {
        $regp = $mi;
        }
      $regc++;
      }
    else {
      if ($regc > 0 && $regc < $minlen) {
        for (my $mj=$regp; $mj<$mi; $mj++) {
          $myseqscore[$mj] = 0;
          }
        }
      $regc = 0;
      } 
    }
  return(@myseqscore);
  }

sub seqscore2cutcharge {
  my ($winlen,@myseqscore) = @_;
  my $negc = 0;
  my $posc = 0;
  my $proc = 0;
  my $cutc = 0;
  my $cutt = $winlen/2;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myseqscore[$mi] > 0) {
      if (substr($myseqscore[0],$mi-1,1) eq 'E' || substr($myseqscore[0],$mi-1,1) eq 'D') {
        $negc++;
        }
      if (substr($myseqscore[0],$mi-1,1) eq 'K' || substr($myseqscore[0],$mi-1,1) eq 'R' || substr($myseqscore[0],$mi-1,1) eq 'H') {
        $posc++;
        }
      # if (substr($myseqscore[0],$mi-1,1) eq 'P') {
      #  $proc++;
      #  }
      if ($negc >= 2 || $posc >= 2 || $proc >= 2) {
        $myseqscore[$mi] = 0;
        $cutc++;
        }
      if ($cutc >= $cutt) {
        $negc = 0;
        $posc = 0;
        $proc = 0;
        $cutc = 0;
        }
      }
    else {
      $negc = 0;
      $posc = 0;
      $proc = 0;
      } 
    }
  return(@myseqscore);
  }

sub seqscore2gtd {
  my ($winlen,@myseqscore) = @_;
  my @myseqscoreori = @myseqscore;
  @myseqscore = seqscore2setpositive(@myseqscore);
  my ($av,$std) = seqscore2avstd(@myseqscore);
  $myseqscore[1] = 0;

  for (my $mi=2; $mi<=$#myseqscore; $mi++) {
    $myseqscore[$mi] = abs($myseqscoreori[$mi-1]-$myseqscoreori[$mi])*$myseqscore[$mi]*abs($myseqscore[$mi]-$av)/$std;
    }
  @myseqscore = seqscore2preavwin($winlen,@myseqscore);
  @myseqscore = seqscore2norm(100,@myseqscore);
  return(@myseqscore);
  }

sub seqscore2gt {
  my ($winlen,$mythresh,@myseqscore) = @_;
  @myseqscore = seqscore2setpositive(@myseqscore);
  my ($av,$std) = seqscore2avstd(@myseqscore);
  if ($std > 0) {
    for (my $mi=1; $mi<=$#myseqscore; $mi++) {
      $myseqscore[$mi] = $myseqscore[$mi]*abs($myseqscore[$mi]-$av)/$std;
      }
    @myseqscore = seqscore2preavwin($winlen,@myseqscore);
    @myseqscore = seqscore2norm(100,@myseqscore);
    @myseqscore = seqscore2cutnoise(@myseqscore);
    @myseqscore = seqscore2flatten(3,@myseqscore);
    }
  return(@myseqscore);
  }

sub seqscore2flatten {
  my ($numit,@myseqscore) = @_;
  for (my $ni=1; $ni<=$numit; $ni++) {
    my @myseqscoreori = @myseqscore;
    for (my $mi=2; $mi<$#myseqscore; $mi++) {
      $myseqscore[$mi] = ($myseqscoreori[$mi-1]+$myseqscoreori[$mi]+$myseqscoreori[$mi+1])/3;
      }
    }
  return(@myseqscore);
  }

sub seqscore2cutnoise {
  my (@myseqscore) = @_;
  my ($av,$std) = seqscore2avstd(@myseqscore);
  #~ print "$av\t$std\n";
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myseqscore[$mi] < $std) {
      $myseqscore[$mi] = 0;
      }
    }
  return(@myseqscore);
  }

sub seqscore2cutoff {
  my ($mythresh,@myseqscore) = @_;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myseqscore[$mi] < $mythresh) {
      $myseqscore[$mi] = 0;
      }
    }
  return(@myseqscore);
  }

sub seqscore2delta {
  my (@myseqscore) = @_;
  $myseqscore[1] = 0;
  for (my $mi=2; $mi<=$#myseqscore; $mi++) {
    $myseqscore[$mi] = $myseqscore[$mi-1]-$myseqscore[$mi];
    }
  return(@myseqscore);
  }

sub seqscore2norm {
  my ($mymaxnorm,@myseqscore) = @_;
  my $mymin = seqscore2min(@myseqscore);
  my $mymax = seqscore2max(@myseqscore);
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if (($mymax-$mymin) > 0) {
      $myseqscore[$mi] = $mymaxnorm*($myseqscore[$mi]-$mymin)/($mymax-$mymin);
      }
    }
  return(@myseqscore);
  }

sub seqscore2preavwin {
  my ($winlen,@myseqscore) = @_;
  my @myseqscoreori = @myseqscore;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    my $myscore = 0;
    my $mycount = 0;
    for (my $mj=0; $mj<$winlen; $mj++) {
      if (($mi-$mj) >= 1) {
        $mycount++;
        $myscore = $myscore + $myseqscoreori[$mi-$mj];
        }
      }
    $myseqscore[$mi] = $myscore/$mycount;
    }
  return(@myseqscore);
  }

sub seqscore2setzero {
  my ($mythresh,@myseqscore) = @_;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    $myseqscore[$mi] = $myseqscore[$mi] - $mythresh;
    }
  return(@myseqscore);
  }

sub seqscore2setpositive {
  my (@myseqscore) = @_;
  my $mymin = seqscore2min(@myseqscore);
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    $myseqscore[$mi] = $myseqscore[$mi] - $mymin;
    }
  return(@myseqscore);
  }

sub seqscore2setpositiveOFF {
  my (@myseqscore) = @_;
  my $mymin = seqscore2min(@myseqscore);
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    $myseqscore[$mi] = $myseqscore[$mi] - $mymin;
    }
  return((-1*$mymin),@myseqscore);
  }

sub seqscore2min {
  my (@myseqscore) = @_;
  my $mymin = 100000000;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myseqscore[$mi] < $mymin) {
      $mymin = $myseqscore[$mi];
      }
    }
  return($mymin);
  }

sub seqscore2max {
  my (@myseqscore) = @_;
  my $mymax = -100000000;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myseqscore[$mi] > $mymax) {
      $mymax = $myseqscore[$mi];
      }
    }
  return($mymax);
  }

sub seqscore2avstd {
  my (@myseqscore) = @_;
  my $myav = 0;
  my $mystd = 0;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    $myav = $myav + $myseqscore[$mi];
    }
  $myav = $myav/$#myseqscore;
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    $mystd = $mystd + ($myav-$myseqscore[$mi])*($myav-$myseqscore[$mi]);
    }
  if (($#myseqscore-1) > 0) {
    $mystd = sqrt($mystd/($#myseqscore-1));
    }
  return($myav,$mystd);
  }

sub readMatrix {
  my ($myfile) = @_;
  my @mymat;
  open (FILE, "$myfile") || die ("ERROR: readMatrix() could not open file '$myfile' !!!\n");
  my $comline;
  my $allcom = "";
  my $mlen = 0;
  my @alphabet;
  my @scores;
  my $thresh = 0;
  while (defined(my $line = <FILE>)) {
    if ($line =~ /^#/) {  
      $comline = $line;
      $allcom = $allcom . $comline;
      }
    if ($line =~ /^# [Tt]hresh ([0-9\.\-]+)/) {  
      $thresh = $1;
      }
    if ($line =~ /^\d+/) { 
      if ($mlen == 0 && $comline =~ /^#\t([^\r\n]+)/) {
        @alphabet = split(/\t/, $1);
        }
      if ($line =~ /^(\d+)\t(.+)/) { # warning! trailing tabs required for proper parsing of alphabet and values
        $mlen++;
        $mymat[$mlen][0] = $1;
        @scores = split(/\t/, $2);
        for (my $i=0; $i<($#alphabet+1); $i++) {
          $mymat[0][$i+1] = $alphabet[$i];
          $mymat[$1][$i+1] = $scores[$i];
          } 
        }
      }
    }
  $mymat[0][0] = $mlen;
  $mymat[$mymat[0][0]+1][0] = $#alphabet+1;
  $mymat[$mymat[0][0]+1][1] = $allcom;
  $mymat[$mymat[0][0]+1][2] = $thresh;
  close(FILE);
  return(@mymat);
  }

sub printMatrix {
  my (@mymat) = @_;
  print "$mymat[$mymat[0][0]+1][1]";
  for (my $mi=1; $mi<=$mymat[0][0]; $mi++) {
    print "$mymat[$mi][0]\t";
    for (my $mj=1; $mj<=$mymat[$mymat[0][0]+1][0]; $mj++) {
      printf "%.4f\t", $mymat[$mi][$mj];
      }
    print "\n";
    }
  }

sub matrix2AAindex {
  my (@mymat) = @_;
  my %myAAindex;
  for (my $mj=1; $mj<=$mymat[$mymat[0][0]+1][0]; $mj++) {
    $myAAindex{$mymat[0][$mj]} = $mj;
    }
  return(%myAAindex);
  }

sub scoreSeqMat {
  my ($myseq,@mymat) = @_;
  my @myseqscore;
  my %AAindex = matrix2AAindex(@mymat);
  $myseqscore[0] = $myseq;
  for (my $mi=1; $mi<=length($myseq)-$mymat[0][0]+1; $mi++) {
    my $myscore = 0;
    for (my $mj=$mi; $mj<$mi+$mymat[0][0]; $mj++) {
      my $aa = substr($myseq,$mj-1,1);
      #~ print STDERR "--> $mi $mj $aa $AAindex{$aa}\n";
      if (exists($AAindex{$aa})) {
        $myscore = $myscore + $mymat[$mj-$mi+1][$AAindex{$aa}];
        }
      }
    #~ print "-> $mi $myseq $myscore\n";
    $myseqscore[$mi] = $myscore;
     }
  return(@myseqscore);
  }

sub printSeqHits {
  my ($myoutopt,$mythresh,$myid,@myseqscore) = @_;
  my $bestpos;
  my $bestmot;
  my $bestscore = -1000000;
  my $myhits = 0;
  if ($myoutopt eq 'tango') {
    printf "$myid\t";
    }
  for (my $mi=1; $mi<=$#myseqscore; $mi++) {
    if ($myoutopt eq 'all' && $myseqscore[$mi] >= $mythresh) {
      printf "%s\t$mi\t%f\t$myid\n",substr($myseqscore[0],$mi-1,length($myseqscore[0])-$#myseqscore+1),$myseqscore[$mi];
      $myhits++;
      }
    if ($myoutopt eq 'full') {
      printf "%s\t$mi\t%f\t\n",substr($myseqscore[0],$mi-1,length($myseqscore[0])-$#myseqscore+1),$myseqscore[$mi];
      $myhits++;
      }
    if ($myoutopt eq 'perres') {
      printf "%s\t$mi\t%f\t$myid\n",substr($myseqscore[0],$mi-1,1),$myseqscore[$mi];
      $myhits++;
      }
    if ($myoutopt eq 'tango') {
      printf "%f\t",$myseqscore[$mi];
      $myhits++;
      }
    if ($bestscore < $myseqscore[$mi]) {
      $bestscore = $myseqscore[$mi];
      $bestpos = $mi;
      $bestmot = substr($myseqscore[0],$mi-1,length($myseqscore[0])-$#myseqscore+1);
      }
    }
  if (($myoutopt eq 'best' || $myoutopt eq 'opp') && $bestscore >= $mythresh) {
    print "$bestmot\t$bestpos\t$bestscore\t$myid\n";
    $myhits++;
    }
  if ($myoutopt eq 'opp' && $bestscore < $mythresh) {
    print "$bestmot\t$bestpos\tNOT_$bestscore\t$myid\n";
    }
  if ($myoutopt eq 'perres') {
    for (my $mi=$#myseqscore+1; $mi<=length($myseqscore[0]); $mi++) {
      printf "%s\t$mi\t%f\t$myid\n",substr($myseqscore[0],$mi-1,1),$myseqscore[$#myseqscore];
      #~ printf "%s\t$mi\t%f\t$myid\n",substr($myseqscore[0],$mi-1,1),$myseqscore[$#myseqscore]/sqrt($mi+1-$#myseqscore);
      $myhits++;
      }
    }
  if ($myoutopt eq 'tango') {
    for (my $mi=$#myseqscore+1; $mi<=length($myseqscore[0]); $mi++) {
      printf "%f\t",$myseqscore[$#myseqscore];
      $myhits++;
      }
    print "\n";
    }
  print  "\n";
  return($myhits);
  }

