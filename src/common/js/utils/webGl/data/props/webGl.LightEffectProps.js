require("../../NameSpace.js");

createClass(WebGl, "LightEffectProps", ASJS.BaseClass, function(_scope) {
  var _callback;

  var _anchorX = 0;
  var _anchorY = 0;
  var _quadX   = 1;
  var _quadY   = 1;

  _scope.new = function(callback) {
    _callback = callback;
    _callback();
  }

  prop(_scope, "anchorX", {
    get: function() { return _anchorX; },
    set: function(v) { _anchorX = v; _callback(); }
  });

  prop(_scope, "anchorY", {
    get: function() { return _anchorY; },
    set: function(v) { _anchorY = v; _callback(); }
  });

  prop(_scope, "quadX", {
    get: function() { return _quadX; },
    set: function(v) { _quadX = v; _callback(); }
  });

  prop(_scope, "quadY", {
    get: function() { return _quadY; },
    set: function(v) { _quadY = v; _callback(); }
  });
});
