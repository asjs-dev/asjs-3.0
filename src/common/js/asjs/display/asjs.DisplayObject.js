require("../geom/asjs.Rectangle.js");
require("../geom/asjs.GeomUtils.js");
require("../utils/asjs.Mouse.js");
require("./asjs.Tag.js");

createClass(ASJS, "DisplayObject", ASJS.Tag, function(_scope, _super) {
  var _mouse    = ASJS.Mouse.instance;
  var _filters  = [];
  var _rotation = 0;
  var _scaleX   = 1;
  var _scaleY   = 1;
  var _skewX    = 0;
  var _skewY    = 0;
  var _bounds   = ASJS.Rectangle.create();

  _scope.new = function(tag) {
    _super.new(tag);
    _scope.tabindex = -1;
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

  prop(_scope, "visible", {
    get: function() { return _scope.getCSS("display") !== "none" && _scope.alpha > 0; },
    set: function(v) {
      v
        ? _scope.removeCSS("display")
        : _scope.setCSS("display", "none");
    }
  });

  ASJS.Tag.cssProp(_scope, "alpha", "opacity");

  prop(_scope, "x", {
    get: function() { return getOffset(ASJS.DisplayObject.OFFSET_LEFT); },
    set: _scope.setCSS.bind(_scope, "left")
  });

  prop(_scope, "y", {
    get: function() { return getOffset(ASJS.DisplayObject.OFFSET_TOP); },
    set: _scope.setCSS.bind(_scope, "top")
  });

  prop(_scope, "width", {
    get: function() { return getOffset(ASJS.DisplayObject.OFFSET_WIDTH); },
    set: _scope.setCSS.bind(_scope, "width")
  });

  prop(_scope, "height", {
    get: function() { return getOffset(ASJS.DisplayObject.OFFSET_HEIGHT); },
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
    _bounds   =
    _mouse    =
    _filters  =
    _rotation =
    _scaleX   =
    _scaleY   =
    _skewX    =
    _skewY    = null;

    _super.destruct();
  }

  function getOffset(type) {
    var offset   = _scope.el["offset" + type];
    var position = _scope.getCSS(type.toLowerCase());
    var margin   = _scope.getCSS("margin" + type);

    var translate = 0;
    if (ASJS.DisplayObject.TRANSLATE_OFFSET.has(type)) {
      var transform = _scope.getCSS("transform");
      if (!ASJS.DisplayObject.EMPTY_CSS_VALUES.has(transform)) {
        var parsedTransform = transform.replace("matrix(", "").replace(")", "").split(",");
        translate = parseFloat(parsedTransform[type === ASJS.DisplayObject.OFFSET_LEFT ? 4 : 5]);
      }
    }

    var parsedPosition = parseFloat(position);
    var parsedMargin   = parseFloat(margin);

    return position === parsedPosition && margin === parsedMargin
      ? parsedMargin + parsedPosition + translate
      : offset + translate;
  }

  function drawFilters() {
    var filters = "";
    var filter;
    var i = -1;
    while (filter = _filters[++i]) filters += " " + filter.execute();
    _scope.setCSS("filter", filters);
  }

  var drawTransform = throttleFunction(function() {
    _scope.setCSS(
      "transform",
      "rotate(" + _rotation + "deg) " +
      "scaleX(" + _scaleX + ") " +
      "scaleY(" + _scaleY + ") " +
      "skewX(" + _skewX + "deg) " +
      "skewY(" + _skewY + "deg) "
    );
  });
});

cnst(ASJS.DisplayObject, "OFFSET_TOP",       "Top");
cnst(ASJS.DisplayObject, "OFFSET_LEFT",      "Left");
cnst(ASJS.DisplayObject, "OFFSET_WIDTH",     "Width");
cnst(ASJS.DisplayObject, "OFFSET_HEIGHT",    "Height");
cnst(ASJS.DisplayObject, "TRANSLATE_OFFSET", [ASJS.DisplayObject.OFFSET_LEFT, ASJS.DisplayObject.OFFSET_TOP]);
cnst(ASJS.DisplayObject, "POSITIONS",        ["absolute", "fixed", "sticky"]);
cnst(ASJS.DisplayObject, "PARENT_POSITIONS", ["", 0, "unset", "static", "inherit", "initial"]);
cnst(ASJS.DisplayObject, "EMPTY_CSS_VALUES", ["", 0, "none"]);
