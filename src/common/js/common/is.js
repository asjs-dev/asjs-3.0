var is = function(a, b) {
  try {
    return a instanceof b;
  } catch (e) {
    return false;
  }
}
