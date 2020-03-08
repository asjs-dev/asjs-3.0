require("./asjs.DisplayObject.js");
require("../core/asjs.Polyfill.js");
require("../geom/asjs.GeomUtils.js");
require("../event/asjs.DocumentEvent.js");

createClass(ASJS, "ScrollBar", ASJS.Sprite, function(_scope, _super) {
  var _target;

  var _previousOffsetSize     = new ASJS.Point();
  var _previousScrollSize     = new ASJS.Point();
  var _previousScrollPosition = new ASJS.Point();
  var _verticalScrollBar      = new ASJS.DisplayObject();
  var _horizontalScrollBar    = new ASJS.DisplayObject();

  _scope.new = function() {
    _super.new();
    _scope.enabled = false;
  }

  prop(_scope, "target", {
    get: function() { return _target; },
    set: function(v) {
      if (_target === v) return;
      destruct();
      _target = v;
      init();
    }
  });

  get(_scope, "verticalScrollBar", function() { return _verticalScrollBar; });
  get(_scope, "horizontalScrollBar", function() { return _horizontalScrollBar; });

  _scope.update = animationFrameFunction(function() {
    if (!_target) return;

    var offsetSize     = new ASJS.Point(_target.el.offsetWidth, _target.el.offsetHeight);
    var scrollPosition = new ASJS.Point(_target.el.scrollLeft,  _target.el.scrollTop);
    var scrollSize     = new ASJS.Point(_target.el.scrollWidth, _target.el.scrollHeight);

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

      _scope.setSize(offsetSize.x, offsetSize.y);

      function draw(scrollBar, positionName, sizeName) {
        if (offsetSize[positionName] < scrollSize[positionName]) {
          !_scope.contains(scrollBar) && _scope.addChild(scrollBar);
          var percent = (offsetSize[positionName] / scrollSize[positionName]);
          scrollBar[sizeName]     = Math.floor(offsetSize[positionName] * percent);
          scrollBar[positionName] = Math.floor(scrollPosition[positionName] * percent);
          _scope[positionName]    = scrollPosition[positionName];
        } else if (_scope.contains(scrollBar)) {
          _scope.removeChild(scrollBar);
        }
      }

      draw(_horizontalScrollBar, "x", "width");
      draw(_verticalScrollBar,   "y", "height");
    }

    offsetSize.destruct();
    offsetSize = null;

    scrollPosition.destruct();
    scrollPosition = null;

    scrollSize.destruct();
    scrollSize = null;
  });

  _scope.destruct = function() {
    destruct();

    _target = null;

    _previousOffsetSize.destruct();
    _previousOffsetSize = null;

    _previousScrollSize.destruct();
    _previousScrollSize = null;

    _previousScrollPosition.destruct();
    _previousScrollPosition = null;

    _verticalScrollBar.destruct();
    _verticalScrollBar = null;

    _horizontalScrollBar.destruct();
    _horizontalScrollBar = null;

    _super.destruct();
  }

  function onScroll(event) {
    if (!_target) return;

    var scrollDelta = ASJS.Polyfill.getScrollData(event);

    _target.el.scrollLeft += scrollDelta.x;
    _target.el.scrollTop  += scrollDelta.y;

    _scope.update();
  }

  function destruct() {
    if (!_target) return;

    _target.removeEventListener(ASJS.DocumentEvent.DOM_SUBTREE_MODIFIED, _scope.update);
    _target.removeEventListener(ASJS.MouseEvent.WHEEL,                   onScroll);

    _target.removeCSS("overflow");

    _scope.contains(_horizontalScrollBar) && _scope.removeChild(_horizontalScrollBar);
    _scope.contains(_verticalScrollBar)   && _scope.removeChild(_verticalScrollBar);

    _scope.move(0, 0);
  }

  function init() {
    if (!_target) return;

    _target.addEventListener(ASJS.DocumentEvent.DOM_SUBTREE_MODIFIED, _scope.update);
    _target.addEventListener(ASJS.MouseEvent.WHEEL,                   onScroll);

    _target.setCSS("overflow", "hidden");

    _scope.update();
  }
});
