require("./webGl.Item.js");
require("../NameSpace.js");

createClass(WebGl, "Light", WebGl.Item, function(_scope, _super) {
  _scope.effect = {
    "anchorX" : 0,
    "anchorY" : 0,
    "quadX"   : 1,
    "quadY"   : 1
  };

  _scope.positionCache = new Float32Array(3);
  _scope.volumeCache   = new Float32Array(3);
  _scope.effectCache   = new Float32Array(4);

  var _protectedOverride = {};

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.effect        =
    _scope.positionCache =
    _scope.volumeCache   =
    _scope.effectCache   =
    _protectedOverride   = null;

    _super.destruct();
  }

  override(_super.protected, _protectedOverride, "updateProps");
  _super.protected.updateProps = function(transformFunction) {
    _protectedOverride.updateProps(transformFunction);

    _scope.positionCache[0] = _scope.matrixCache[12];
    _scope.positionCache[1] = _scope.matrixCache[13];
    _scope.positionCache[2] = _scope.matrixCache[14];

    _scope.volumeCache[0] = _scope.matrixCache[0];
    _scope.volumeCache[1] = _scope.matrixCache[5];
    _scope.volumeCache[2] = _scope.matrixCache[10];

    _scope.effectCache[0] = _scope.effect.anchorX;
    _scope.effectCache[1] = _scope.effect.anchorY;
    _scope.effectCache[2] = _scope.effect.quadX;
    _scope.effectCache[3] = _scope.effect.quadY;
  }
});
