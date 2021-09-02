require("./NameSpace.js");

helpers.addUniqueToArray = helpers.addUniqueToArray || function(array, item) {
  array.indexOf(item) < 0 && array.push(item);
}
