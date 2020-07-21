require("../../NameSpace.js");

createClass(WebGl, "TextureCrop", ASJS.BaseClass, function(_scope) {
  var _callback;

  var _x      = 0;
  var _y      = 0;
  var _width  = 1;
  var _height = 1;

  _scope.new = function(callback) {
    _callback = callback;
    _callback();
  }

  prop(_scope, "x", {
    get: function() { return _x; },
    set: function(v) { _x = v; _callback(); }
  });

  prop(_scope, "y", {
    get: function() { return _y; },
    set: function(v) { _y = v; _callback(); }
  });

  prop(_scope, "width", {
    get: function() { return _width; },
    set: function(v) { _width = v; _callback(); }
  });

  prop(_scope, "height", {
    get: function() { return _height; },
    set: function(v) { _height = v; _callback(); }
  });
});
