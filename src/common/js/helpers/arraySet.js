require("./NameSpace.js");

helpers.arraySet = helpers.arraySet || function(target, source, from) {
  var i = 0;
  var l = source.length;
  while (i < l) {
    target[from + i] = source[i];
    ++i;
  }
}
