let express = require('express');
let router = express.Router();
let validationService = require('../services/validationService.js');

function getlength(r){
  var L = 1;
  var Lmax = 1;
  var LRange=100;
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
  var t5 =(329*lp*r**2)/(120*lc**3);
  var t6 =(6799*r**4)/(1600*lc**4);
  var t7 =(3441*r**6)/(2800*lp*lc**5);
  var t8 =(1089*r**8)/(12800*(lp**2)*(lc**6));
  var b=1-t1+t2-t3-t4-t5+t6-t7+t8;
  var exp=a*b;


    p=Math.pow((3/4*Math.PI*lc*lp),3/2)* Math.pow(Math.E,exp);
    if (p>pmax){
      pmax=p;
      Lmax=L;
    }
    L=L+0.0001;
  }
    console.log(pmax);
    return Lmax;

}

function getLengthByMap(r){
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

  return MapDistanceLinker.get(r.toString());

}


router.get('/', function(req, res, next) {

  if (validationService.isValidDistance(req.query.distance)) {
    res.json({
      length: getLengthByMap(Number(req.query.distance)).toFixed(),
      distance: Number(req.query.distance)
    });
  } else {
    return res.status(400).send({
      message: 'Invalid distance value ' + req.query.distance
    });
  }
});

module.exports = router;
