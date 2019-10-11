let express = require('express');
let router = express.Router();
let validationService = require('../services/validationService.js');

function getlength(r){
  var L = 0.0001;
  var Lmax = 1;
  var LRange=1000;
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

router.get('/', function(req, res, next) {

  if (validationService.isValidDistance(req.query.distance)) {
    res.json({
      length: getlength(Number(req.query.distance)).toFixed(2),
      distance: Number(req.query.distance)
    });
  } else {
    return res.status(400).send({
      message: 'Invalid distance value ' + req.query.distance
    });
  }
});

module.exports = router;
