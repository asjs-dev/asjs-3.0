require("../geom/asjs.Rectangle.js");
require("../geom/asjs.GeomUtils.js");
require("../utils/asjs.Mouse.js");
require("./asjs.Tag.js");

createClass(ASJS, "DisplayObject", ASJS.Tag, function(_scope, _super) {
  var priv = {};

  cnst(priv, "OFFSET_TOP",    "Top");
  cnst(priv, "OFFSET_LEFT",   "Left");
  cnst(priv, "OFFSET_WIDTH",  "Width");
  cnst(priv, "OFFSET_HEIGHT", "Height");

  var _mouse      = ASJS.Mouse.instance;
  var _filters    = [];
  var _rotation   = 0;
  var _scaleX     = 1;
  var _scaleY     = 1;
  var _bounds     = new ASJS.Rectangle();

  var _cssDisplay;

  _scope.new = function(tag) {
    _super.new(tag);
    _scope.tabindex = -1;
    _cssDisplay = _scope.setCSS("display");
  }

  get(_scope, "bounds", function() {
    _bounds.x      = _scope.x;
    _bounds.y      = _scope.y;
    _bounds.width  = _scope.width;
    _bounds.height = _scope.height;
    return _bounds;
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
      var filter;
      var i = -1;
      while (filter = _filters[++i]) filters += " " + filter.execute();
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
    get: function() { return getOffset(priv.OFFSET_LEFT); },
    set: function(v) { _scope.setCSS("left", v); }
  });

  prop(_scope, "y", {
    get: function() { return getOffset(priv.OFFSET_TOP); },
    set: function(v) { _scope.setCSS("top", v); }
  });

  prop(_scope, "width", {
    get: function() { return getOffset(priv.OFFSET_WIDTH); },
    set: function(v) { _scope.setCSS("width", v); }
  });

  prop(_scope, "height", {
    get: function() { return getOffset(priv.OFFSET_HEIGHT); },
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
    document.fullscreenEnabled && _scope.el.requestFullscreen();
  };

  _scope.exitFullscreen = function() {
    document.fullscreenEnabled && document.exitFullscreen();
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

  _scope.destruct = function() {
    _mouse      = null;
    _filters    = null;
    _rotation   = null;
    _scaleX     = null;
    _scaleY     = null;
    _cssDisplay = null;

    _bounds.destruct();
    _bounds = null;

    _super.destruct();
  }

  function getOffset(type) {
    var offset         = _scope.el["offset" + type];
    var position       = _scope.getCSS(type.toLowerCase());
    var margin         = _scope.getCSS("margin" + type);
    var parsedPosition = parseFloat(position);
    var parsedMargin   = parseFloat(margin);

    return position === parsedPosition && margin === parsedMargin
      ? parsedMargin + parsedPosition
      : offset;
  }

  function drawTransform() {
    _scope.setCSS("transform", 'rotate(' + _rotation + 'deg) scaleX(' + _scaleX + ') scaleY(' + _scaleY + ')');
  }
});
