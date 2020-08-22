require("./property.js");

var constant = function(t, n, v) {
  prop(t, n, {value: v});
}
var cnst = constant;
