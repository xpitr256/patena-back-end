function getlength(r){
    var L = 1;
    var Lmax = 1;
    var LRange=100;
    var b = 3.8;
   // var lc = b*L;
    var lp = 3;
    var p;
    var pmax;
    var result=[];
    pmax=0;
    while (L<LRange){

        var a =((-3*(8**2))/(4*lp*r*b));
        var t1 =(5*lp)/(4*r*b);
        var t2 =(2*(8**2))/((r*b)**2);
        var t3 =(33*(8**4))/(80*lp*((r*b)**3));
        var t4 =(79*(lp**2))/(160*((r*b)**2));
        var t5 =(329*8*r**2*3.04)/(120*(r*b)**3);
        var t6 =(6799*(8**4))/(1600*((r*b)**4));
        var t7 =(3441*(8**6))/(2800*lp*((r*b)**5));
        var t8 =(1089*(8**8))/(12800*(lp**2)*((r*b)**6));
        var b=1-t1+t2-t3-t4-t5+t6-t7+t8;
        var exp=a*b;

 /*       y := (10000000/6.022)*(3/(4*pi*3.00*(x*3.8)))^(3/2)*

            exp((-3*a[1]^2)/(4*lp*(x*3.8)))*


            (1

                -((5*3.00)      /(4*(x*3.8)))

                +((2*a[1]^2)    /((x*3.8)^2))

                -((33*a[1]^4)   /(80*3.00*(x*3.8)^3))

                -((79*3.00^2)   /(160*(x*3.8)^2))

                -((329*a[1]^2*3.04)/(120*(x*3.8)^3))

                +((6799*a[1]^4) /(1600*(x*3.8)^4))

                -((3441*a[1]^6) /(2800*3.00*(x*3.8)^5))

                +((1089*a[1]^8) /(12800*3.00^2*(x*3.8)^6))*/





        p=(10000000/6.022)*Math.pow(3/(4*Math.PI*lp*(r*b)),3/2)* Math.exp(exp);
        if (p>pmax){
            pmax=p;
            Lmax=L;
        }
        L=L+0.5;
    }
    //console.log(pmax);
    result.push(Lmax);
    result.push(pmax);
    return result;


}

function getLengthByR(r){
    var L = 1;
    var Lmax = 1;
    var LRange=81;
    var b = 3.8;
    var lc = b*L;
    var lp = 3;
    var p;
    var pmax;
    var result=[];
    pmax=0;
    while (L<LRange){
        lc = b*L;
        var a =(-3*(r**2)/(4*lp*lc));
        var t1 =(5*lp)/(4*lc);
        var t2 =(2*(r**2))/(lc**2);
        var t3 =(33*(r**4))/(80*lp*(lc**3));
        var t4 =(79*(lp**2))/(160*(lc**2));
        var t5 =(329*lp*(r**2))/(120*(lc**3));
        var t6 =(6799*(r**4))/(1600*(lc**4));
        var t7 =(3441*(r**6))/(2800*lp*(lc**5));
        var t8 =(1089*(r**8))/(12800*(lp**2)*(lc**6));
        var b=1-t1+t2-t3-t4-t5+t6-t7+t8;
        var exp=a*b;

        p=Math.pow((3/4*Math.PI*lc*lp),3/2)* Math.exp(exp);

        console.log(L,p);

        L=L+1;
    }
    //console.log(pmax);

    return result;

}

let MapDistanceLinker = new Map();
MapDistanceLinker.set('1',0.74);
MapDistanceLinker.set('2',0.14);
MapDistanceLinker.set('3',0.10);
MapDistanceLinker.set('4',0.56);
MapDistanceLinker.set('5',0.87);
MapDistanceLinker.set('6',1.25);
MapDistanceLinker.set('7',1.85);
MapDistanceLinker.set('8',2.37);
MapDistanceLinker.set('9',2.94);
MapDistanceLinker.set('10',3.54);
MapDistanceLinker.set('11',4.15);
MapDistanceLinker.set('12',4.72);
MapDistanceLinker.set('13',11.28);
MapDistanceLinker.set('14',12.69);
MapDistanceLinker.set('15',14.13);
MapDistanceLinker.set('16',7.99);
MapDistanceLinker.set('17',19.60);
MapDistanceLinker.set('18',22.13);
MapDistanceLinker.set('19',23.87);
MapDistanceLinker.set('20',27.62);
MapDistanceLinker.set('21',34.06);
MapDistanceLinker.set('22',25.04);
MapDistanceLinker.set('23',34.54);
MapDistanceLinker.set('24',28.37);
MapDistanceLinker.set('25',39.35);
MapDistanceLinker.set('26',31.77);
MapDistanceLinker.set('27',33.50);
MapDistanceLinker.set('28',35.24);
MapDistanceLinker.set('29',37.00);
MapDistanceLinker.set('30',38.77);
MapDistanceLinker.set('31',26.14);
MapDistanceLinker.set('32',42.35);
MapDistanceLinker.set('33',59.94);
MapDistanceLinker.set('34',62.64);
MapDistanceLinker.set('35',47.82);
MapDistanceLinker.set('36',49.66);
MapDistanceLinker.set('37',51.51);
MapDistanceLinker.set('38',91.79);
MapDistanceLinker.set('39',55.24);
MapDistanceLinker.set('40',57.11);
MapDistanceLinker.set('41',58.99);
MapDistanceLinker.set('42',95.90);
MapDistanceLinker.set('43',62.76);
MapDistanceLinker.set('44',47.93);
MapDistanceLinker.set('45',66.55);
MapDistanceLinker.set('46',68.45);
MapDistanceLinker.set('47',53.72);
MapDistanceLinker.set('48',72.25);
MapDistanceLinker.set('49',74.14);
MapDistanceLinker.set('50',76.04);
MapDistanceLinker.set('51',77.92);
MapDistanceLinker.set('52',79.81);
MapDistanceLinker.set('53',81.68);
MapDistanceLinker.set('54',83.54);
MapDistanceLinker.set('55',70.72);
MapDistanceLinker.set('56',64.40);
MapDistanceLinker.set('57',75.39);
MapDistanceLinker.set('58',90.82);
MapDistanceLinker.set('59',92.57);
MapDistanceLinker.set('60',82.84);
MapDistanceLinker.set('61',95.92);
MapDistanceLinker.set('62',97.48);
MapDistanceLinker.set('63',98.91);
MapDistanceLinker.set('64',94.33);
MapDistanceLinker.set('65',98.37);
MapDistanceLinker.set('66',0.10);
MapDistanceLinker.set('67',0.10);
MapDistanceLinker.set('68',0.10);
MapDistanceLinker.set('69',0.10);
MapDistanceLinker.set('70',0.10);
MapDistanceLinker.set('71',0.10);
MapDistanceLinker.set('72',0.10);
MapDistanceLinker.set('73',0.10);
MapDistanceLinker.set('74',0.10);
MapDistanceLinker.set('75',0.10);
MapDistanceLinker.set('76',0.10);
MapDistanceLinker.set('77',0.10);
MapDistanceLinker.set('78',0.10);
MapDistanceLinker.set('79',0.10);
MapDistanceLinker.set('80',0.10);
MapDistanceLinker.set('81',0.10);
MapDistanceLinker.set('82',0.10);
MapDistanceLinker.set('83',0.10);
MapDistanceLinker.set('84',0.10);
MapDistanceLinker.set('85',0.10);
MapDistanceLinker.set('86',0.10);
MapDistanceLinker.set('87',0.10);
MapDistanceLinker.set('88',0.10);
MapDistanceLinker.set('89',0.10);
MapDistanceLinker.set('90',0.10);
MapDistanceLinker.set('91',0.10);
MapDistanceLinker.set('92',0.10);
MapDistanceLinker.set('93',0.10);
MapDistanceLinker.set('94',0.10);
MapDistanceLinker.set('95',0.10);
MapDistanceLinker.set('96',0.10);
MapDistanceLinker.set('97',0.10);
MapDistanceLinker.set('98',0.10);
MapDistanceLinker.set('99',0.10);
MapDistanceLinker.set('100',0.10);



/*

for (var i = 1; i < 80; i++) {
    console.log(i.toString()+"\t"+getlength(i).toFixed());
}
*/
/*
for (var i = 1; i < 100; i++) {
    console.log(MapDistanceLinker.get(i.toString()));
}*/

/*function Zhou_Probability_Function;

defaults

a[1] := 8, inactive, 'dist';


begin




y := (10000000/6.022)*(3/(4*pi*3.00*(x*3.8)))^(3/2)*

exp((-3*a[1]^2)/(4*3.00*(x*3.8)))*


(1

-((5*3.00)      /(4*(x*3.8)))

+((2*a[1]^2)    /((x*3.8)^2))

-((33*a[1]^4)   /(80*3.00*(x*3.8)^3))

-((79*3.00^2)   /(160*(x*3.8)^2))

-((329*a[1]^2*3.04)/(120*(x*3.8)^3))

+((6799*a[1]^4) /(1600*(x*3.8)^4))

-((3441*a[1]^6) /(2800*3.00*(x*3.8)^5))

+((1089*a[1]^8) /(12800*3.00^2*(x*3.8)^6))


)



end;*/


function calculateLengthReplicaIgnacio(r){
    var L = 2;
    var Lmax = 1;
    var LRange=80;
    var b = 3.8;
    var lc = b*L;
    var lp = 3;
    var p;
    var pmax;

    pmax=0;
    while (L<LRange){
        lc = b*L;
        var a =(-3*(r**2)/(4*lp*lc));
        var t1 =(5*lp)/(4*lc);
        var t2 =(2*r**2)/(lc**2);
        var t3 =(33*r**4)/(80*lp*lc**3);
        var t4 =(79*lp**2)/(160*lc**2);
        var t5 =(329*lp*r**2*3.04)/(120*lc**3);
        var t6 =(6799*r**4)/(1600*lc**4);
        var t7 =(3441*r**6)/(2800*lp*lc**5);
        var t8 =(1089*r**8)/(12800*(lp**2)*(lc**6));
        var b=1-t1+t2-t3-t4-t5+t6-t7+t8;
        var exp=a*b;


        p=(10000000/6.022)*((3/4*Math.PI*lc*lp)**(3/2))* Math.exp(exp);
        if (p>pmax){
            pmax=p;
            Lmax=L;
        }
        L=L+0.5;//4	17	38	69	80	80

    }
    console.log(r.toFixed(1)+"\t\t\t"+Lmax.toFixed());
    return Lmax;

}


let r=10
let delta=10
let rmax=101
let result=[];

while (r<rmax){
    result= calculateLengthReplicaIgnacio(r);
   // console.log(r.toFixed(1)+"\t\t\t"+result.toFixed());
    r=r+delta;
}


