require("./NameSpace.js");

helpers.addUniqueToArray = function(array, item) {
  array.indexOf(item) < 0 && array.push(item);
}
