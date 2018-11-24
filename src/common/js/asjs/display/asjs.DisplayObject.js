require("../geom/asjs.Rectangle.js");
require("../geom/asjs.GeomUtils.js");
require("../utils/asjs.Mouse.js");
require("./asjs.PrimitiveDisplayObject.js");

ASJS.DisplayObject = createClass(
"DisplayObject",
ASJS.PrimitiveDisplayObject,
function(_scope, _super) {
  var _mouse      = ASJS.Mouse.instance;
  var _filters    = [];
  var _rotation   = 0;
  var _scaleX     = 1;
  var _scaleY     = 1;
  var _cssDisplay = "block";

  _scope.new = function(tag) {
    _super.new(tag);
    _scope.tabindex = -1;
    _scope.setCSS("pointer-events", "auto");
    _scope.setCSS("position", "absolute");
    _scope.setCSS("display", _cssDisplay);
    _scope.setCSS("box-sizing", "border-box");
  }

  get(_scope, "bounds", function() { return new ASJS.Rectangle(_scope.calcX, _scope.calcY, _scope.calcWidth, _scope.calcHeight); });

  get(_scope, "calcX", function() { return _scope.x + _scope.getCSS("marginLeft"); });

  get(_scope, "calcY", function() { return _scope.y + _scope.getCSS("marginTop"); });

  get(_scope, "calcWidth", function() {
    var paddingLeft  = _scope.getCSS("paddingLeft");
    var paddingRight = _scope.getCSS("paddingRight");
    var borderLeft   = _scope.getCSS("borderLeft");
    var borderRight  = _scope.getCSS("borderRight");
    return _scope.width + paddingLeft + paddingRight + borderLeft + borderRight;
  });

  get(_scope, "calcHeight", function() {
    var paddingTop    = _scope.getCSS("paddingTop");
    var paddingBottom = _scope.getCSS("paddingBottom");
    var borderTop     = _scope.getCSS("borderTop");
    var borderBottom  = _scope.getCSS("borderBottom");
    return _scope.height + paddingTop + paddingBottom + borderTop + borderBottom;
  });

  get(_scope, "mouse", function() { return _mouse.getRelativePosition(_scope); });

  prop(_scope, "tabIndex", {
    get: function() { return _scope.getAttr("tabindex"); },
    set: function(v) { _scope.setAttr("tabindex", v); }
  });

  prop(_scope, "tooltip", {
    get: function() { return _scope.setAttr("title"); },
    set: function(v) { _scope.setAttr("title", v); }
  });

  prop(_scope, "filters", {
    get: function() { return _filters; },
    set: function(v) {
      _filters = v;
      var filters = "";
      var i = -1;
      var l = _filters.length;
      while (++i < l) filters += " " + _filters[i].execute();
      _scope.setCSS("filter", filters);
    }
  });

  prop(_scope, "display", {
    get: function() { return _cssDisplay; },
    set: function(v) {
      _cssDisplay = v;
      _scope.setCSS("display", _cssDisplay);
    }
  });

  prop(_scope, "visible", {
    get: function() { return _scope.getCSS("display") != "none"; },
    set: function(v) { _scope.setCSS("display", v ? _cssDisplay : "none"); }
  });

  prop(_scope, "alpha", {
    get: function() { return _scope.getCSS("opacity"); },
    set: function(v) { _scope.setCSS("opacity", v); }
  });

  prop(_scope, "x", {
    get: function() { return _scope.getCSS("left"); },
    set: function(v) { _scope.setCSS("left", v); }
  });

  prop(_scope, "y", {
    get: function() { return _scope.getCSS("top"); },
    set: function(v) { _scope.setCSS("top", v); }
  });

  prop(_scope, "width", {
    get: function() { return _scope.getCSS("width"); },
    set: function(v) { _scope.setCSS("width", v); }
  });

  prop(_scope, "height", {
    get: function() { return _scope.getCSS("height"); },
    set: function(v) { _scope.setCSS("height", v); }
  });

  prop(_scope, "rotation", {
    get: function() { return _rotation; },
    set: function(v) {
      _rotation = parseFloat(v);
      drawTransform();
    }
  });

  prop(_scope, "scaleX", {
    get: function() { return _scaleX; },
    set: function(v) {
      _scaleX = parseFloat(v);
      drawTransform();
    }
  });

  prop(_scope, "scaleY", {
    get: function() { return _scaleY; },
    set: function(v) {
      _scaleY = parseFloat(v);
      drawTransform();
    }
  });

  _scope.requestFullscreen = function() {
    if (!document.fullscreenEnabled) return;
    _scope.el.requestFullscreen();
  };

  _scope.exitFullscreen = function() {
    if (!document.fullscreenEnabled) return;
    document.exitFullscreen();
  };

  _scope.scale = function(scaleX, scaleY) {
    _scope.scaleX = scaleX;
    _scope.scaleY = scaleY;
  };

  _scope.move = function(x, y) {
    _scope.x = x;
    _scope.y = y;
  }

  _scope.setSize = function(w, h) {
    _scope.width = w;
    _scope.height = h;
  }

  _scope.hitTest = function(point) {
    return ASJS.GeomUtils.hitTest(_scope, point);
  }

  _scope.localToGlobal = function(point) {
    return ASJS.GeomUtils.localToGlobal(_scope, point);
  };

  _scope.globalToLocal = function(point) {
    return ASJS.GeomUtils.globalToLocal(_scope, point);
  };

  function drawTransform() {
    _scope.setCSS("transform", 'rotate(' + _rotation + 'deg) scaleX(' + _scaleX + ') scaleY(' + _scaleY + ')');
  }
});
