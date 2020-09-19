var addUniqueToArray = function(array, item) {
  array.indexOf(item) == -1 && array.push(item);
}
var inArray = function(array, item) {
  return array.indexOf(item) > -1;
}
var removeFromArray = function(array, item) {
  var index = array.indexOf(item);
  index > -1 && array.splice(index, 1);
}
var cloneArray = function(array) {
  return array.slice(0);
}
var areArraysEqual = function(arrayA, arrayB) {
  if (!arrayA || arrayA.length !== arrayB.length) return false;

  for (var i = 0; i < arrayB.length; i++) {
    if (arrayB[i] !== arr[i]) return false;
  }

  return true;
}

var arraySet = function(target, source, from) {
  var i = 0;
  var l = source.length;
  while (i < l) {
    target[from + i] = source[i];
    ++i;
  }
}
