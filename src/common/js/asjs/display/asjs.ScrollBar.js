require("./asjs.DisplayObject.js");
require("../core/asjs.Polyfill.js");
require("../geom/asjs.GeomUtils.js");
require("../event/asjs.DocumentEvent.js");

createClass(ASJS, "ScrollBar", ASJS.Sprite, function(_scope, _super) {
  var _previousOffsetSize     = new ASJS.Point();
  var _previousScrollSize     = new ASJS.Point();
  var _previousScrollPosition = new ASJS.Point();

  var _scrollableContainer = new ASJS.Sprite();
  var _scrollBarContainer  = new ASJS.Sprite();
  var _verticalScrollBar   = new ASJS.DisplayObject();
  var _horizontalScrollBar = new ASJS.DisplayObject();

  var _scrollSpeed     = 1;
  var _horizontalAngle = 1;
  var _verticalAngle   = 1;

  _scope.new = function() {
    _super.new();

    _scope.addChild(_scrollableContainer);

    _scrollableContainer.addEventListener(ASJS.DocumentEvent.DOM_SUBTREE_MODIFIED, _scope.update);
    _scrollableContainer.addEventListener(ASJS.MouseEvent.WHEEL,                   onScroll);

    _scrollableContainer.setSize("100%", "100%");
    _scrollableContainer.setCSS("overflow", "hidden");

    _scrollBarContainer.enabled = false;
    _scrollBarContainer.setSize("100%", "100%");
    _scope.addChild(_scrollBarContainer);

    _super.protected.lock();
  }

  get(_scope, "container", function() { return _scrollableContainer; });

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
    var offsetSize = new ASJS.Point(
      _scrollableContainer.width,
      _scrollableContainer.height
    );

    var scrollPosition = new ASJS.Point(
      _scrollableContainer.el.scrollLeft,
      _scrollableContainer.el.scrollTop
    );

    var scrollSize = new ASJS.Point(
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

      draw(_horizontalScrollBar, offsetSize, scrollSize, scrollPosition, "x", "width");
      draw(_verticalScrollBar,   offsetSize, scrollSize, scrollPosition, "y", "height");
    }

    offsetSize.destruct();
    offsetSize = null;

    scrollPosition.destruct();
    scrollPosition = null;

    scrollSize.destruct();
    scrollSize = null;
  });

  _scope.destruct = function() {
    _super.destruct();

    _previousOffsetSize.destruct();
    _previousOffsetSize = null;

    _previousScrollSize.destruct();
    _previousScrollSize = null;

    _previousScrollPosition.destruct();
    _previousScrollPosition = null;

    _scrollableContainer.destruct();
    _scrollableContainer = null;

    _scrollBarContainer.destruct();
    _scrollBarContainer = null;

    _verticalScrollBar.destruct();
    _verticalScrollBar = null;

    _horizontalScrollBar.destruct();
    _horizontalScrollBar = null;
  }

  function draw(scrollBar, offsetSize, scrollSize, scrollPosition, positionName, sizeName) {
    if (offsetSize[positionName] < scrollSize[positionName]) {
      !_scrollBarContainer.contains(scrollBar) && _scrollBarContainer.addChild(scrollBar);
      var percent = (offsetSize[positionName] / scrollSize[positionName]);
      scrollBar[sizeName]     = Math.floor(offsetSize[positionName] * percent);
      scrollBar[positionName] = Math.floor(scrollPosition[positionName] * percent);
    } else if (_scrollBarContainer.contains(scrollBar)) _scrollBarContainer.removeChild(scrollBar);
  }

  function onScroll(event) {
    var scrollDelta = ASJS.Polyfill.getScrollData(event);

    _scrollableContainer.el.scrollLeft += scrollDelta.x * _horizontalAngle * _scrollSpeed;
    _scrollableContainer.el.scrollTop  += scrollDelta.y * _verticalAngle * _scrollSpeed;

    _scope.update();
  }
});
