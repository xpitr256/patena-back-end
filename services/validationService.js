
function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}

function isPositiveNumber(value){
  return ( isInt(value) &&  value > 0 ) ? true :false;
}

module.exports = {

  isValidDistance : function (distance) {

    if (!distance) {
      return false;
    }

    if (!isPositiveNumber(distance)) {
      return false;
    }

    return true;
  }
};
