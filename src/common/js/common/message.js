require("./property.js");

var message = function(t, n) {
  try {
    cnst(t, n, "e" + Date.now() + "" + message.id++);
  } catch (e) {
    trace("ERROR", n);
  }
};
message.id = 0;
var msg = message;
