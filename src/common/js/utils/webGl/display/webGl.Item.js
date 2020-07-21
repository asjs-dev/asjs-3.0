require("../NameSpace.js");
require("../data/props/webGl.ItemProps.js");
require("../data/props/webGl.ColorProps.js");

createClass(WebGl, "Item", ASJS.BaseClass, function(_scope, _super) {
  var _matrixUtils = WebGl.Matrix3;

  var _prt = _super.protected;

  _scope.renderable  = true;
  _scope.interactive = false;

  _scope.matrixCache = _matrixUtils.identity();
  _scope.colorCache  = new Float32Array(4);

  _scope.parentMatrix = _matrixUtils.identity();

  _prt.updateList = [];

  _prt.parent = null;

  _scope.new = function() {
    _scope.props = new WebGl.ItemProps(_scope.updateProps);
    _scope.color = new WebGl.ColorProps(_scope.updateColor);
  }

  prop(_scope, "parent", {
    get: function() { return _prt.parent; },
    set: function(v) {
      if (empty(v) || v.getChildIndex(_scope) > -1) _prt.parent = v;
    }
  });

  get(_scope, "stage", function() { return _scope.parent ? _scope.parent.stage : null; });

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _prt.parent && _prt.parent.removeChild && _prt.parent.removeChild(_scope);

    _scope.props.destruct();
    _scope.color.destruct();

    _scope.props             =
    _scope.color             =
    _scope.renderable        =
    _scope.colorCache        =
    _scope.matrixCache       =
    _scope.parentMatrix      =
    _scope.parent            = null;

    _super.destruct();
  }

  _scope.void       = emptyFunction;
  _scope.preRender  = emptyFunction;
  _scope.postRender = emptyFunction;

  _scope.updateProps = function() {
    _prt.updateList.push(_prt.updateProps);
  }

  _scope.updateColor = function() {
    _prt.updateList.push(_prt.updateColor);
  }

  _scope.update = function(transformFunction) {
    _prt.parent.shouldUpdateProps && _scope.updateProps();

    var fv;
    while (fv = _prt.updateList.shift()) fv(transformFunction);
  }

  _prt.updateProps = function(transformFunction) {
    var props = _scope.props;

    var sx = props.scaleX;
    var sy = props.scaleY;

    transformFunction(
      _scope.parentMatrix,

      props.x,
      props.y,

      props.rotation,

      props.anchorX * sx,
      props.anchorY * sy,

      props.width  * sx,
      props.height * sy,

      _scope.matrixCache
    );
  }

  _prt.updateColor = function() {
    var color = _scope.color;

    _scope.colorCache[0] = color.r;
    _scope.colorCache[1] = color.g;
    _scope.colorCache[2] = color.b;
    _scope.colorCache[3] = color.a;
  }
});
