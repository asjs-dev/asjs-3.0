require("./NameSpace.js");

helpers.arraySet = helpers.arraySet || function(target, source, from) {
  source.forEach(function(item, i) {
    target[from + i] = item;
  });
}
