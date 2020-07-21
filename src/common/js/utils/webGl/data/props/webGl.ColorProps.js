require("../../NameSpace.js");

createClass(WebGl, "ColorProps", ASJS.BaseClass, function(_scope) {
  var _callback;

  var _r = 1;
  var _g = 1;
  var _b = 1;
  var _a = 1;

  _scope.new = function(callback) {
    _callback = callback;
    _callback();
  }

  prop(_scope, "r", {
    get: function() { return _r; },
    set: function(v) { _r = v; _callback(); }
  });

  prop(_scope, "g", {
    get: function() { return _g; },
    set: function(v) { _g = v; _callback(); }
  });

  prop(_scope, "b", {
    get: function() { return _b; },
    set: function(v) { _b = v; _callback(); }
  });

  prop(_scope, "a", {
    get: function() { return _a; },
    set: function(v) { _a = v; _callback(); }
  });
});
