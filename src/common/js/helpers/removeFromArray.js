require("./NameSpace.js");

helpers.removeFromArray = (array, item) => {
  var index = array.indexOf(item);
  index > -1 && array.splice(index, 1);
}
