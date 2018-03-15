var Iterator = createClass(
"Iterator",
ASJS.BaseClass,
function(_scope) {
  var _steps = [];
  var _response;
  var _step = -1;

  _scope.new = function(steps) {
    if (steps && steps.length) {
      var i = -1;
      var l = steps.length;
      while (++i < l) _scope.add(steps[i]);
    }
  }

  _scope.add = function(fv) {
    fv && tis(fv, "function") && _steps.indexOf(fv) === -1 && _steps.push(fv);
    return _scope;
  }

  _scope.next = function(value) {
    _response = _steps[++_step](_response || value);
    if (_step >= _steps.length - 1) _step = -1;
    return _response;
  }
});
