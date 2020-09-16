require("./typeIs.js");

function clone(a) {
  if (tis(a, "object")) return a;

  var b = Array.isArray(a)
    ? []
    : {};
  var propNames = Object.getOwnPropertyNames(a);
  var i = propNames.length;
  var key;
  while (i--) {
    key = propNames[i];
    b[key] = tis(a[key], "object")
      ? clone(a[key])
      : a[key];
  }
  return b;
};
