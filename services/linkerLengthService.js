const DistanceLength = require ('../model/schema/DistanceLength');

function calculateLength(r){
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
    console.log(r.toFixed(1)+"\t\t\t"+Lmax.toFixed());
    return Lmax;

}

async function getLength(distance){

    let result = await( DistanceLength.find({
        distance: distance.toString()
    }, "-_id -__v "));

    return result;
}


module.exports = {
    generateLength : async function() {
        let r = 1.0;
        let delta = 0.1
        let rmax = 100
        while (r <= rmax) {
            try {
                distanceLength = new DistanceLength({
                    distance: r.toString(),
                    length: calculateLength(r)
                });
                await distanceLength.save();
            } catch (e) {
                console.error(e);
                return e;
            }
            r = r + delta;
            r = Math.round(r*10)/10;
        }
    },
    getLength : async function (distance){
        const result =  await getLength(distance);
        if (result) {
            return  Math.round(Number(result[0]['length']));
        }
        return 0;
    }
};