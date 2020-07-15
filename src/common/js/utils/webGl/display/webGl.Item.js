require("../NameSpace.js");

createClass(WebGl, "Item", ASJS.BaseClass, function(_scope, _super) {
  _scope.props = {
    "x"         : 0,
    "y"         : 0,
    "z"         : 0,
    "rotationX" : 0,
    "rotationY" : 0,
    "rotationZ" : 0,
    "scaleX"    : 1,
    "scaleY"    : 1,
    "scaleZ"    : 1,
    "width"     : 1,
    "height"    : 1,
    "depth"     : 1,
    "anchorX"   : 0,
    "anchorY"   : 0,
    "anchorZ"   : 0,
  };

  _scope.color = {
    "r" : 1,
    "g" : 1,
    "b" : 1,
    "a" : 1
  };

  _scope.renderable  = true;
  _scope.enabled     = true;
  _scope.interactive = false;

  _scope.matrixCache = WebGl.MatrixUtils.identity();
  _scope.colorCache  = new Float32Array(4);

  _scope.parentMatrix = null;

  var _parent = null;

  prop(_scope, "parent", {
    get: function() { return _parent; },
    set: function(v) {
      if (empty(v) || v.getChildIndex(_scope) > -1) _parent = v;
    }
  });

  get(_scope, "stage", function() { return _scope.parent ? _scope.parent.stage : null; });

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.props                =
    _scope.color                =
    _scope.renderable           =
    _scope.enabled              =
    _scope.colorCache           =
    _scope.matrixCache          =
    _scope.parentMatrix         =
    _scope.parent               = null;

    _super.destruct();
  }

  _scope.preRender  = function() {}
  _scope.postRender = function() {}

  _scope.updateProperties = function(transformFunction) {
    var props = _scope.props;

    var sx = props.scaleX;
    var sy = props.scaleY;
    var sz = props.scaleZ;

    transformFunction(
      _scope.parentMatrix,

      props.x,
      props.y,
      props.z,

      props.rotationX,
      props.rotationY,
      props.rotationZ,

      props.anchorX * sx,
      props.anchorY * sy,
      props.anchorZ * sz,

      props.width  * sx,
      props.height * sy,
      props.depth  * sz,

      _scope.matrixCache
    );

    _scope.updateColorCache();
  }

  _scope.updateColorCache = function() {
    var color = _scope.color;

    _scope.colorCache[0] = color.r;
    _scope.colorCache[1] = color.g;
    _scope.colorCache[2] = color.b;
    _scope.colorCache[3] = color.a;
  }
});
