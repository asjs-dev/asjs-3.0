require("../../event/asjs.EventDispatcher.js");

helpers.createClass(ASJS, "AbstractModel", ASJS.EventDispatcher, function(_scope) {
  var priv = {};

  helpers.constant(priv, "PREFIX", "ASJS-AbstractModel-");

  var _data = {};

  helpers.property(_scope, "data", {
    get: function() { return _data; },
    set: function(v) {
      _data = v;
      _scope.dispatchEvent(ASJS.AbstractModel.CHANGED);
    }
  });

  _scope.get = function(k) {
    return _data && !helpers.isEmpty(_data[k]) ? _data[k] : null;
  }

  _scope.set = function(k, v) {
    if (!_data) _data = {};
    var o = _data[k];
    _data[k] = v;
    _scope.dispatchEvent(ASJS.AbstractModel.CHANGED);
    _scope.dispatchEvent(priv.PREFIX + k, [o, v]);
  }

  _scope.clear = function() {
    _data = null;
    _scope.dispatchEvent(ASJS.AbstractModel.CLEARED);
  }

  _scope.watch = function(k, l) {
    _scope.addEventListener(priv.PREFIX + k, l);
  }

  _scope.merge = function(data) {
    merge(_data, data);
  }

  function merge(oData, nData) {
    helpers.map(nData, function(k, item) {
      helpers.typeIs(oData[k], "object")
        ? merge(oData[k], item)
        : oData[k] = item;
    });
  }
});
helpers.message(ASJS.AbstractModel, "CHANGED");
helpers.message(ASJS.AbstractModel, "CLEARED");
