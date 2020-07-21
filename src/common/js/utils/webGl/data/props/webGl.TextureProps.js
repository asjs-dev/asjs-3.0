require("../../NameSpace.js");

createClass(WebGl, "TextureProps", ASJS.BaseClass, function(_scope) {
  var _callback;

  var _x        = 0;
  var _y        = 0;
  var _rotation = 0;
  var _width    = 1;
  var _height   = 1;
  var _anchorX  = 0;
  var _anchorY  = 0;

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

  prop(_scope, "rotation", {
    get: function() { return _rotation; },
    set: function(v) { _rotation = v; _callback(); }
  });

  prop(_scope, "width", {
    get: function() { return _width; },
    set: function(v) { _width = v; _callback(); }
  });

  prop(_scope, "height", {
    get: function() { return _height; },
    set: function(v) { _height = v; _callback(); }
  });

  prop(_scope, "anchorX", {
    get: function() { return _anchorX; },
    set: function(v) { _anchorX = v; _callback(); }
  });

  prop(_scope, "anchorY", {
    get: function() { return _anchorY; },
    set: function(v) { _anchorY = v; _callback(); }
  });
});
