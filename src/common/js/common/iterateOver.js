require("./empty.js");

var iterateOver = function(o, cb, ccb) {
  if (emp(o)) return en();
  var ks = Object.keys(o);
  var k;
  var i = -1;
  function en() {
    ccb && ccb();
  }
  function n() {
    i++;
    if (i === ks.length) {
      en();
      return;
    }
    k = ks[i];
    if (o.hasOwnProperty && !o.hasOwnProperty(k)) n();
    var iv;
    try {
      iv = o[k];
    } catch (e) {}
    var v = cb(k, iv, n, en);
    if (!emp(v)) o[k] = v;
  }
  n();
}
var ito = iterateOver;
