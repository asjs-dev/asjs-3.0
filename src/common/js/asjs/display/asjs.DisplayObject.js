require("../geom/asjs.Rectangle.js");
require("../geom/asjs.GeomUtils.js");
require("../utils/asjs.Mouse.js");
require("./asjs.Tag.js");

helpers.createClass(ASJS, "DisplayObject", ASJS.Tag, function(_scope, _super) {
  var _mouse    = ASJS.Mouse.instance;
  var _filters  = [];
  var _rotation = 0;
  var _scaleX   = 1;
  var _scaleY   = 1;
  var _skewX    = 0;
  var _skewY    = 0;
  var _bounds   = ASJS.Rectangle.create();

  helpers.override(_scope, _super, "new");
  _scope.new = function(tag) {
    _super.new(tag);
    _scope.tabindex = -1;
  }

  helpers.get(_scope, "bounds", function() {
    _bounds.x      = _scope.x;
    _bounds.y      = _scope.y;
    _bounds.width  = _scope.width;
    _bounds.height = _scope.height;
    return _bounds;
  });

  helpers.get(_scope, "mouse", function() { return _mouse.getRelativePosition(_scope); });

  ASJS.Tag.attrProp(_scope, "tabindex");
  ASJS.Tag.attrProp(_scope, "tooltip");

  helpers.property(_scope, "filters", {
    get: function() { return _filters; },
    set: function(v) {
      _filters = v;
      drawFilters();
    }
  });

  helpers.property(_scope, "visible", {
    get: function() { return _scope.getCSS("display") !== "none" && _scope.alpha > 0; },
    set: function(v) {
      v
        ? _scope.removeCSS("display")
        : _scope.setCSS("display", "none");
    }
  });

  ASJS.Tag.cssProp(_scope, "alpha", "opacity");

  helpers.property(_scope, "x", {
    get: function() { return getOffset(ASJS.DisplayObject.OFFSET_LEFT); },
    set: _scope.setCSS.bind(_scope, "left")
  });

  helpers.property(_scope, "y", {
    get: function() { return getOffset(ASJS.DisplayObject.OFFSET_TOP); },
    set: _scope.setCSS.bind(_scope, "top")
  });

  helpers.property(_scope, "width", {
    get: function() { return getOffset(ASJS.DisplayObject.OFFSET_WIDTH); },
    set: _scope.setCSS.bind(_scope, "width")
  });

  helpers.property(_scope, "height", {
    get: function() { return getOffset(ASJS.DisplayObject.OFFSET_HEIGHT); },
    set: _scope.setCSS.bind(_scope, "height")
  });

  helpers.property(_scope, "rotation", {
    get: function() { return _rotation; },
    set: function(v) {
      _rotation = parseFloat(v);
      drawTransform();
    }
  });

  helpers.property(_scope, "scaleX", {
    get: function() { return _scaleX; },
    set: function(v) {
      _scaleX = parseFloat(v);
      drawTransform();
    }
  });

  helpers.property(_scope, "scaleY", {
    get: function() { return _scaleY; },
    set: function(v) {
      _scaleY = parseFloat(v);
      drawTransform();
    }
  });

  helpers.property(_scope, "skewX", {
    get: function() { return _skewX; },
    set: function(v) {
      _skewX = parseFloat(v);
      drawTransform();
    }
  });

  helpers.property(_scope, "skewY", {
    get: function() { return _skewY; },
    set: function(v) {
      _skewY = parseFloat(v);
      drawTransform();
    }
  });

  _scope.requestFullscreen = function() {
    document.isFullscreenEnabled() && _scope.el.requestFullscreen();
  };

  _scope.exitFullscreen = function() {
    document.isFullscreenEnabled() && document.exitFullscreen();
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

  helpers.override(_scope, _super, "destruct");
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
    if (helpers.inArray(ASJS.DisplayObject.TRANSLATE_OFFSET, type)) {
      var transform = _scope.getCSS("transform");
      if (!helpers.inArray(ASJS.DisplayObject.EMPTY_CSS_VALUES, transform)) {
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

  var drawTransform = helpers.throttleFunction(function() {
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

helpers.constant(ASJS.DisplayObject, "OFFSET_TOP",       "Top");
helpers.constant(ASJS.DisplayObject, "OFFSET_LEFT",      "Left");
helpers.constant(ASJS.DisplayObject, "OFFSET_WIDTH",     "Width");
helpers.constant(ASJS.DisplayObject, "OFFSET_HEIGHT",    "Height");
helpers.constant(ASJS.DisplayObject, "TRANSLATE_OFFSET", [ASJS.DisplayObject.OFFSET_LEFT, ASJS.DisplayObject.OFFSET_TOP]);
helpers.constant(ASJS.DisplayObject, "POSITIONS",        ["absolute", "fixed", "sticky"]);
helpers.constant(ASJS.DisplayObject, "PARENT_POSITIONS", ["", 0, "unset", "static", "inherit", "initial"]);
helpers.constant(ASJS.DisplayObject, "EMPTY_CSS_VALUES", ["", 0, "none"]);
