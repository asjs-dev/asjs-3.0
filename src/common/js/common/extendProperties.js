require("./property.js");

var extendProperties = function(t) {
  var s = {};
  for (var k in t) {
    if (["$n", "constructor"].indexOf(k) === -1) {
      var desc = Object.getOwnPropertyDescriptor(t, k);
      if (!desc) continue;
      if (desc.writable) {
        if (["prot", "protected"].indexOf(k) > -1 || ["number", "string", "boolean", "object"].indexOf(typeof(desc.value)) === -1) s[k] = t[k];
      } else prop(s, k, desc);
    }
  }
  return s;
};
var extProps = extendProperties;
