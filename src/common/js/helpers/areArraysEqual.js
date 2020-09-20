require("./NameSpace.js");

helpers.areArraysEqual = helpers.areArraysEqual || function(arrayA, arrayB) {
  if (!arrayA || arrayA.length !== arrayB.length) return false;

  for (var i = 0; i < arrayB.length; i++) {
    if (arrayB[i] !== arr[i]) return false;
  }

  return true;
}
