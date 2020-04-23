require("./asjs.DisplayObject.js");
require("../core/asjs.Polyfill.js");
require("../geom/asjs.GeomUtils.js");
require("../event/asjs.DocumentEvent.js");

createClass(ASJS, "ScrollBar", ASJS.Sprite, function(_scope, _super) {
  var _previousOffsetSize     = ASJS.Point.create();
  var _previousScrollSize     = ASJS.Point.create();
  var _previousScrollPosition = ASJS.Point.create();

  var _scrollableContainer = new ASJS.Sprite();
  var _scrollBarContainer  = new ASJS.Sprite();
  var _verticalScrollBar   = new ASJS.DisplayObject();
  var _horizontalScrollBar = new ASJS.DisplayObject();

  var _scrollSpeed     = 1;
  var _horizontalAngle = 1;
  var _verticalAngle   = 1;

  var _useNative;

  _scope.new = function() {
    _super.new();

    _scrollableContainer.setSize("100%", "100%");
    _scope.addChild(_scrollableContainer);

    _scrollBarContainer.enabled = false;
    _scrollBarContainer.setSize("100%", "100%");

    _scope.useNative = false;
    _super.protected.lock();
  }

  get(_scope, "container", function() { return _scrollableContainer; });

  prop(_scope, "useNative", {
    get: function() { return _useNative; },
    set: function(v) {
      if (_useNative === v) return;
      _useNative = ASJS.Polyfill.instance.scrollBarSize === 0 ? true : v;
      update();
    }
  });

  prop(_scope, "horizontalAngle", {
    get: function() { return _horizontalAngle; },
    set: function(v) { _horizontalAngle = tis(v, "number") ? Math.sign(v) : 1; }
  });

  prop(_scope, "verticalAngle", {
    get: function() { return _verticalAngle; },
    set: function(v) { _verticalAngle = tis(v, "number") ? Math.sign(v) : 1; }
  });

  prop(_scope, "scrollSpeed", {
    get: function() { return _scrollSpeed; },
    set: function(v) { _scrollSpeed = tis(v, "number") ? v : 1; }
  });

  get(_scope, "verticalScrollBar",   function() { return _verticalScrollBar; });
  get(_scope, "horizontalScrollBar", function() { return _horizontalScrollBar; });

  _scope.update = throttleFunction(function() {
    if (_useNative) return;

    var offsetSize = ASJS.Point.create(
      _scrollableContainer.width,
      _scrollableContainer.height
    );

    var scrollPosition = ASJS.Point.create(
      _scrollableContainer.el.scrollLeft,
      _scrollableContainer.el.scrollTop
    );

    var scrollSize = ASJS.Point.create(
      _scrollableContainer.el.scrollWidth,
      _scrollableContainer.el.scrollHeight
    );

    if (
      !ASJS.GeomUtils.twoPointEquals(scrollSize,     _previousScrollSize) ||
      !ASJS.GeomUtils.twoPointEquals(scrollPosition, _previousScrollPosition) ||
      !ASJS.GeomUtils.twoPointEquals(offsetSize,     _previousOffsetSize)
    ) {
      _previousOffsetSize.x = offsetSize.x;
      _previousOffsetSize.y = offsetSize.y;

      _previousScrollPosition.x = scrollPosition.x;
      _previousScrollPosition.y = scrollPosition.y;

      _previousScrollSize.x = scrollSize.x;
      _previousScrollSize.y = scrollSize.y;

      drawScrollBar(_horizontalScrollBar, offsetSize, scrollSize, scrollPosition, "x", "width");
      drawScrollBar(_verticalScrollBar,   offsetSize, scrollSize, scrollPosition, "y", "height");
    }

    offsetSize     =
    scrollPosition =
    scrollSize     = null;
  });

  _scope.destruct = function() {
    _super.protected.unlock();

    _super.destruct();

    _scrollableContainer.destruct();
    _scrollBarContainer.destruct();
    _verticalScrollBar.destruct();
    _horizontalScrollBar.destruct();

    _previousOffsetSize     =
    _previousScrollSize     =
    _previousScrollPosition =
    _scrollableContainer    =
    _scrollBarContainer     =
    _verticalScrollBar      =
    _horizontalScrollBar    = null;
  }

  function drawScrollBar(scrollBar, offsetSize, scrollSize, scrollPosition, positionName, sizeName) {
    if (offsetSize[positionName] < scrollSize[positionName]) {
      !_scrollBarContainer.contains(scrollBar) && _scrollBarContainer.addChild(scrollBar);
      var percent = (offsetSize[positionName] / scrollSize[positionName]);
      scrollBar[sizeName]     = Math.floor(offsetSize[positionName] * percent);
      scrollBar[positionName] = Math.floor(scrollPosition[positionName] * percent);
    } else if (_scrollBarContainer.contains(scrollBar)) _scrollBarContainer.removeChild(scrollBar);
  }

  function update() {
    _super.protected.unlock();
    var hasListener = _scrollableContainer.hasEventListener(ASJS.MouseEvent.WHEEL, onScroll);
    var containsScrollBarContainer = _scope.contains(_scrollBarContainer);
    if (_useNative) {
      if (hasListener) {
        _scrollableContainer.removeEventListener(ASJS.DocumentEvent.DOM_SUBTREE_MODIFIED, _scope.update);
        _scrollableContainer.removeEventListener(ASJS.MouseEvent.WHEEL,                   onScroll);
      }
      _scrollableContainer.setCSS("overflow", "auto");
      containsScrollBarContainer && _scope.removeChild(_scrollBarContainer);
    } else {
      if (!hasListener) {
        _scrollableContainer.addEventListener(ASJS.DocumentEvent.DOM_SUBTREE_MODIFIED, _scope.update);
        _scrollableContainer.addEventListener(ASJS.MouseEvent.WHEEL,                   onScroll);
      }
      _scrollableContainer.setCSS("overflow", "hidden");
      !containsScrollBarContainer && _scope.addChild(_scrollBarContainer);
    }

    _scope.update();
    _super.protected.lock();
  }

  function onScroll(event) {
    var scrollDelta = ASJS.Polyfill.getScrollData(event);

    _scrollableContainer.el.scrollLeft += scrollDelta.x * _horizontalAngle * _scrollSpeed;
    _scrollableContainer.el.scrollTop  += scrollDelta.y * _verticalAngle * _scrollSpeed;

    _scope.update();
  }
});
