require("./property.js");

var deleteProperty = function(t, p) {
  var desc = Object.getOwnPropertyDescriptor(t, p);
  if (desc && (desc.get || desc.set)) prop(t, p, {set: empfu, get: empfu});
  else {
    try {
      t[p] = null;
    } catch (e) {};
  }
  delete t[p];
}
var del = deleteProperty;
