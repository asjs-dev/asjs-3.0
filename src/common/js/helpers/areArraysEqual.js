require("./NameSpace.js");

helpers.areArraysEqual = function(a, b) {
  if (!a || !b || a.length !== b.length) return false;

  for (var i = 0; i < b.length; i++)
    if (b[i] !== a[i])
      return false;

  return true;
}
