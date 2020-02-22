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
  var _skewX      = 0;
  var _skewY      = 0;
  var _bounds     = new ASJS.Rectangle();

  var _cssDisplay;
  var _transformTimeoutId;

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

  ASJS.Tag.attrProp(_scope, "tabindex");
  ASJS.Tag.attrProp(_scope, "tooltip");

  prop(_scope, "filters", {
    get: function() { return _filters; },
    set: function(v) {
      _filters = v;
      drawFilters();
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

  ASJS.Tag.cssProp(_scope, "alpha", "opacity");

  prop(_scope, "x", {
    get: function() { return getOffset(priv.OFFSET_LEFT); },
    set: _scope.setCSS.bind(_scope, "left")
  });

  prop(_scope, "y", {
    get: function() { return getOffset(priv.OFFSET_TOP); },
    set: _scope.setCSS.bind(_scope, "top")
  });

  prop(_scope, "width", {
    get: function() { return getOffset(priv.OFFSET_WIDTH); },
    set: _scope.setCSS.bind(_scope, "width")
  });

  prop(_scope, "height", {
    get: function() { return getOffset(priv.OFFSET_HEIGHT); },
    set: _scope.setCSS.bind(_scope, "height")
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

  prop(_scope, "skewX", {
    get: function() { return _skewX; },
    set: function(v) {
      _skewX = parseFloat(v);
      drawTransform();
    }
  });

  prop(_scope, "skewY", {
    get: function() { return _skewY; },
    set: function(v) {
      _skewY = parseFloat(v);
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

  _scope.skew = function(skewX, skewY) {
    _scope.skewX = skewX;
    _scope.skewY = skewY;
  };

  _scope.move = function(x, y) {
    _scope.x = x;
    _scope.y = y;
  }

  _scope.setSize = function(w, h) {
    _scope.width = w;
    _scope.height = h;
  }

  _scope.hitTest = ASJS.GeomUtils.hitTest.bind(_scope, _scope);

  _scope.localToGlobal = ASJS.GeomUtils.localToGlobal.bind(_scope, _scope);

  _scope.globalToLocal = ASJS.GeomUtils.globalToLocal.bind(_scope, _scope);

  _scope.destruct = function() {
    _mouse              = null;
    _filters            = null;
    _rotation           = null;
    _scaleX             = null;
    _scaleY             = null;
    _skewX              = null;
    _skewY              = null;
    _cssDisplay         = null;
    _transformTimeoutId = null;

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

  function drawFilters() {
    var filters = "";
    var filter;
    var i = -1;
    while (filter = _filters[++i]) filters += " " + filter.execute();
    _scope.setCSS("filter", filters);
  }

  function drawTransform() {
    clearTimeout(_transformTimeoutId);
    _transformTimeoutId = setTimeout(transform, 1);
  }

  function transform() {
    _scope.setCSS(
      "transform",
      "rotate(" + _rotation + "deg) " +
      "scaleX(" + _scaleX + ") " +
      "scaleY(" + _scaleY + ") " +
      "skewX(" + _skewX + "deg) " +
      "skewY(" + _skewY + "deg) "
    );
  }
});
