var empty = function(a) {
  try {
    return a === undefined || a === null || a === "" || a.length === 0;
  } catch(e) {
    return true;
  }
}
var emp = empty;
