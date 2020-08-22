var property = function(t, n, v) {
  v.enumerable   = true;
  v.configurable = true;
  Object.defineProperty(t, n, v);
}
var prop = property;

var get = function(t, n, v) {
  prop(t, n, {get: v});
};

var set = function(t, n, v) {
  prop(t, n, {set: v});
};

var constant = function(t, n, v) {
  prop(t, n, {value: v});
}
var cnst = constant;

var readOnlyFunction = cnst;
var rof = readOnlyFunction;
