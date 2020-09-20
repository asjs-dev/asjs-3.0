require("./NameSpace.js");

helpers.addUniqueToArray = helpers.addUniqueToArray || function(array, item) {
  array.indexOf(item) == -1 && array.push(item);
}
