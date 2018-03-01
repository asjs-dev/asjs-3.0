ASJS.import("com/asjs/event/asjs.EventDispatcher.js");

ASJS.AbstractModel = createClass(
"AbstractModel",
ASJS.EventDispatcher,
function(_scope) {
  var priv = {};

  cnst(priv, "PREFIX", "ASJS-AbstractModel-");

  var _data = {};

  prop(_scope, "data", {
    get: function() { return _data; },
    set: function(v) {
      _data = v;
      _scope.dispatchEvent(ASJS.AbstractModel.CHANGED);
    }
  });

  _scope.get = function(k) {
    return _data && !empty(_data[k]) ? _data[k] : null;
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

  _scope.merge = function(d) {
    merge(_data, d);
  }

  function merge(oData, nData) {
    for (var nk in nData) {
      if (tis(oData[nk], "object")) merge(oData[nk], nData[nk]);
      else oData[nk] = nData[nk];
    }
  }
});
msg(ASJS.AbstractModel, "CHANGED", "changed");
msg(ASJS.AbstractModel, "CLEARED", "cleared");
