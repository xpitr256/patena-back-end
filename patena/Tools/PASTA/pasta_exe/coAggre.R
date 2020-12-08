######################### interface	#####################

#pair1 <- "spP37840"
pair1 <- commandArgs()[6]
#pair2 <- "HETs_prion"
pair2 <- commandArgs()[7]
#workdir <- "/home/ian/Work/Pasta/pasta2/pasta2_R/pid_1056149993/batch/"
workdir <- commandArgs()[8]
workdir

#########################  FREE ENERGY ###########################
nseq1 <- paste(sep="", workdir, pair1, ".fasta.seq.nseq1");
nseq2 <- paste(sep="", workdir, pair2, ".fasta.seq.nseq2");
energy <- paste(sep="", workdir, "energy")


filein <- paste(sep="", workdir, pair1, "-", pair2, ".free_energy1.dat.pair.dat")
filepdf <- paste(sep="", workdir, pair1, "-", pair2, ".profile1_free_energy.pair.pdf")
filepng <- paste(sep="", workdir, pair1, "-", pair2, ".profile1_free_energy.pair.png")
inp <- scan(nseq1,1)
name <- pair1
name2 <- pair2
# create the co-aggregating pairing free energy 1 PDF (1st protein)
pdf(file=filepdf, width=6,height=5)
A <- read.table(filein)
x <- 1*(1:inp)-0.5
mid <- mean(A[,1])
par(family="serif")
par(mar=c(5.1, 5.1, 5.1, 5.1), xpd=TRUE)
colors <- c("green", "black")
plot(x,A[,1],type="l",xlab="residue number [k]",ylab="Free Energy (1 unit = 1.192 Kcal/mol)",main=paste("aggregation free energy (", name, " with ", name2 , ")"))
e <- scan(energy)
lines( 1:inp, rep(e, inp), col="green")
legend(inp,mid, c("Energy Threshold", "Energy Profile"), cex=0.6, col=colors, colors)
dev.off()

# create the co-aggregating pairing free energy 1 PNG (1st protein)
png(file=filepng, width=5,height=5,units="in",res=300)
inp <- scan(nseq1,1)
A <- read.table(filein)
x <- 1*(1:inp)-0.5
mid <- mean(A[,1])
par(family="serif")
par(mar=c(5.1, 5.1, 5.1, 5.1), xpd=TRUE)
colors <- c("green", "black")
plot(x,A[,1],type="l",xlab="residue number [k]",ylab="Free Energy (1 unit = 1.192 Kcal/mol)",main=paste("aggregation free energy (", name, " with ", name2 , ")"))
e <- scan(energy)
lines( 1:inp, rep(e, inp), col="green")
legend(inp,mid, c("Energy Threshold", "Energy Profile"), cex=0.6, col=colors, colors)
dev.off()








filein <- paste(sep="", workdir, pair1, "-", pair2, ".free_energy2.dat.pair.dat")
filepdf <- paste(sep="", workdir, pair1, "-", pair2, ".profile2_free_energy.pair.pdf")
filepng <- paste(sep="", workdir, pair1, "-", pair2, ".profile2_free_energy.pair.png")
inp <- scan(nseq2,1)
name <- pair2
name2 <- pair1
# create the co-aggregating pairing free energy 2 PDF (2nd protein)
pdf(file=filepdf, width=6,height=5)
A <- read.table(filein)
x <- 1*(1:inp)-0.5
mid <- mean(A[,1])
par(family="serif")
par(mar=c(5.1, 5.1, 5.1, 5.1), xpd=TRUE)
colors <- c("green", "black")
plot(x,A[,1],type="l",xlab="residue number [k]",ylab="Free Energy (1 unit = 1.192 Kcal/mol)",main=paste("aggregation free energy (", name, " with ", name2 , ")"))
e <- scan(energy)
lines( 1:inp, rep(e, inp), col="green")
legend(inp,mid, c("Energy Threshold", "Energy Profile"), cex=0.6, col=colors, colors)
dev.off()

# create the co-aggregating pairing free energy 2 PNG (2nd protein)
png(file=filepng, width=5,height=5,units="in",res=300)
A <- read.table(filein)
x <- 1*(1:inp)-0.5
mid <- mean(A[,1])
par(family="serif")
par(mar=c(5.1, 5.1, 5.1, 5.1), xpd=TRUE)
colors <- c("green", "black")
plot(x,A[,1],type="l",xlab="residue number [k]",ylab="Free Energy (1 unit = 1.192 Kcal/mol)",main=paste("aggregation free energy (", name, " with ", name2 , ")"))
e <- scan(energy)
lines( 1:inp, rep(e, inp), col="green")
legend(inp,mid, c("Energy Threshold", "Energy Profile"), cex=0.6, col=colors, colors)
dev.off()







############################## PROBABILITY ##########################


filein <- paste(sep="", workdir, pair1, "-", pair2, ".aggr_profile1.pair.dat")
filepdf <- paste(sep="", workdir, pair1, "-", pair2, ".profile1.pair.pdf")
filepng <- paste(sep="", workdir, pair1, "-", pair2, ".profile1.pair.png")
inp <- scan(nseq1,1)
name <- pair1
name2 <- pair2
# create the co-aggregating pairing free energy 1 PDF (1st protein)
pdf(file=filepdf, width=6,height=5)
A <- read.table(filein)
x <- 1*(1:inp)-0.5
mid <- mean(A[,1])
par(family="serif")
par(mar=c(5.1, 5.1, 5.1, 5.1), xpd=TRUE)
colors <- c("green", "black")
plot(x,A[,1],type="l",xlab="residue number [k]",ylab="probability(k)",main=paste("aggregation profile (", name, " with ", name2 , ")"))
e <- scan(energy)
lines( 1:inp, rep(e, inp), col="green")
#legend(inp,mid, c("Energy Threshold", "Probability Profile"), cex=0.6, col=colors, colors)
dev.off()

# create the co-aggregating pairing probability profile 1 PNG (1st protein)
png(file=filepng, width=5,height=5,units="in",res=300)
A <- read.table(filein)
x <- 1*(1:inp)-0.5
mid <- mean(A[,1])
par(family="serif")
par(mar=c(5.1, 5.1, 5.1, 5.1), xpd=TRUE)
colors <- c("green", "black")
plot(x,A[,1],type="l",xlab="residue number [k]",ylab="probability(k)",main=paste("aggregation profile (", name, " with ", name2 , ")"))
e <- scan(energy)
lines( 1:inp, rep(e, inp), col="green")
#legend(inp,mid, c("Energy Threshold", "Probability Profile"), cex=0.6, col=colors, colors)
dev.off()






filein <- paste(sep="", workdir, pair1, "-", pair2, ".aggr_profile2.pair.dat")
filepdf <- paste(sep="", workdir, pair1, "-", pair2, ".profile2.pair.pdf")
filepng <- paste(sep="", workdir, pair1, "-", pair2, ".profile2.pair.png")
inp <- scan(nseq2,1)
name <- pair2
name2 <- pair1
# create the co-aggregating pairing free energy 2 PDF (2nd protein)
pdf(file=filepdf, width=6,height=5)
A <- read.table(filein)
x <- 1*(1:inp)-0.5
mid <- mean(A[,1])
par(family="serif")
par(mar=c(5.1, 5.1, 5.1, 5.1), xpd=TRUE)
colors <- c("green", "black")
plot(x,A[,1],type="l",xlab="residue number [k]",ylab="probability(k)",main=paste("aggregation profile (", name, " with ", name2 , ")"))
e <- scan(energy)
lines( 1:inp, rep(e, inp), col="green")
#legend(inp,mid, c("Energy Threshold", "Probability Profile"), cex=0.6, col=colors, colors)
dev.off()

# create the co-aggregating pairing probability profile 2 PNG (2nd protein)
png(file=filepng, width=5,height=5,units="in",res=300)
A <- read.table(filein)
x <- 1*(1:inp)-0.5
mid <- mean(A[,1])
par(family="serif")
par(mar=c(5.1, 5.1, 5.1, 5.1), xpd=TRUE)
colors <- c("green", "black")
plot(x,A[,1],type="l",xlab="residue number [k]",ylab="probability(k)",main=paste("aggregation profile (", name, " with ", name2 , ")"))
e <- scan(energy)
lines( 1:inp, rep(e, inp), col="green")
#legend(inp,mid, c("Energy Threshold", "Probability Profile"), cex=0.6, col=colors, colors)
dev.off()



#################### PROBABILITY PAIRING ######################################
filein <- paste(sep="", workdir, pair1, "-", pair2, ".pairing_mat.pair.dat")
filepdf <- paste(sep="", workdir, pair1, "-", pair2, ".pairing_mat.pair.pdf")
filepng <- paste(sep="", workdir, pair1, "-", pair2, ".pairing_mat.pair.png")
inp1 <- scan(nseq1,1)
inp2 <- scan(nseq2,1)
name1 <- pair1
name2 <- pair2

pdf(file=filepdf)
A <- matrix(scan(filein, n = inp1*inp2), inp1, inp2, byrow = TRUE)
y <- 1*(1:ncol(A))
x <- 1*(1:nrow(A))
image(x,y,-A,col=gray((0:50)/50),xlab=paste(sep="", "residue number ", name1, " [k]"),ylab=paste(sep="", "residue number ", name2, " [m]"),main="Probability(k,m)")
box(which="plot")
dev.off() 



png(file=filepng, width=5,height=5,units="in",res=300)
A <- matrix(scan(filein, n = inp1*inp2), inp1, inp2, byrow = TRUE)
y <- 1*(1:ncol(A))
x <- 1*(1:nrow(A))
image(x,y,-A,col=gray((0:50)/50),xlab=paste(sep="", "residue number ", name1, " [k]"),ylab=paste(sep="", "residue number ", name2, " [m]"),main="Probability(k,m)")
box(which="plot")
dev.off()




#################### FREE ENERGY PAIRING ######################################
filein <- paste(sep="", workdir, pair1, "-", pair2, ".pairing_free_energy.pair.dat")
filepdf <- paste(sep="", workdir, pair1, "-", pair2, ".pairing_mat_free_energy.pair.pdf")
filepng <- paste(sep="", workdir, pair1, "-", pair2, ".pairing_mat_free_energy.pair.png")
inp1 <- scan(nseq1,1)
inp2 <- scan(nseq2,1)
name1 <- pair1
name2 <- pair2

pdf(file=filepdf)
A <- matrix(scan(filein, n = inp1*inp2), inp1, inp2, byrow = TRUE)
y <- 1*(1:ncol(A))
x <- 1*(1:nrow(A))
image(x,y,-A,col=gray((0:50)/50),xlab=paste(sep="", "residue number ", name1, " [k]"),ylab=paste(sep="", "residue number ", name2, " [m]"),main="Probability(k,m)")
box(which="plot")
dev.off()



png(file=filepng, width=5,height=5,units="in",res=300)
A <- matrix(scan(filein, n = inp1*inp2), inp1, inp2, byrow = TRUE)
y <- 1*(1:ncol(A))
x <- 1*(1:nrow(A))
image(x,y,-A,col=gray((0:50)/50),xlab=paste(sep="", "residue number ", name1, " [k]"),ylab=paste(sep="", "residue number ", name2, " [m]"),main="Probability(k,m)")
box(which="plot")
dev.off()


q()

