require("./empty.js");

var map = function(o, cb) {
  for (var k in o) {
    if (!o.hasOwnProperty(k)) continue;
    var v = cb(k, o[k]);
    if (!emp(v)) o[k] = v;
  }
}
