require("./NameSpace.js");

helpers.arraySet = helpers.arraySet || function(target, source, from) {
  var i = source.length;
  while (--i > -1) target[from + i] = source[i];
}
