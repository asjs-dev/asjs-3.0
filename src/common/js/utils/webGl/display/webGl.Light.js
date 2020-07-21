require("./webGl.Item.js");
require("../NameSpace.js");
require("../data/props/webGl.LightEffectProps.js");

createClass(WebGl, "Light", WebGl.Item, function(_scope, _super) {
  var _prt = _super.protected;

  _scope.positionCache = new Float32Array(2);
  _scope.volumeCache   = new Float32Array(2);
  _scope.effectCache   = new Float32Array(4);

  var _protectedOverride = {};

  override(_scope, _super, "new");
  _scope.new = function() {
    _super.new();

    _scope.effect = new WebGl.LightEffectProps(_scope.updateEffect);
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.effect.destruct();
    
    _scope.effect        =
    _scope.positionCache =
    _scope.volumeCache   =
    _scope.effectCache   =
    _protectedOverride   = null;

    _super.destruct();
  }

  _scope.updateEffect = function() {
    _prt.updateList.push(_prt.updateEffect);
  }

  override(_prt, _protectedOverride, "updateProps");
  _prt.updateProps = function(transformFunction) {
    _protectedOverride.updateProps(transformFunction);

    _scope.positionCache[0] = _scope.matrixCache[6];
    _scope.positionCache[1] = _scope.matrixCache[7];

    _scope.volumeCache[0] = _scope.matrixCache[0];
    _scope.volumeCache[1] = _scope.matrixCache[4];
  }

  _prt.updateEffect = function() {
    _scope.effectCache[0] = _scope.effect.anchorX;
    _scope.effectCache[1] = _scope.effect.anchorY;
    _scope.effectCache[2] = _scope.effect.quadX;
    _scope.effectCache[3] = _scope.effect.quadY;
  }
});
