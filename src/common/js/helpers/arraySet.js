require("./NameSpace.js");

helpers.arraySet = (target, source, from) => {
  var i = source.length;
  while (--i > -1) target[from + i] = source[i];
}
