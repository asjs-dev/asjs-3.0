ASJS.Promise = createClass(
"Promise",
ASJS.BaseClass,
function(_scope) {
  var _resolveFunction = [];
  var _rejectFunction  = [];
  var _finallyFunction = [];
  var _calledResolve   = false;
  var _calledReject    = false;
  var _calledFinally   = false;

  _scope.resolve = function(data) {
    _calledResolve = true;
    _calledFinally = true;
    callResolve(data);
    callFinally();
  }

  _scope.reject = function(data) {
    _calledReject = true;
    _calledFinally = true;
    callReject(data);
    callFinally();
  }

  _scope.then = function(f) {
    if (_resolveFunction.indexOf(f) === -1) {
      _resolveFunction.push(f);
      callResolve();
    }
    return _scope;
  }

  _scope.catch = function(f) {
    if (_rejectFunction.indexOf(f) === -1) {
      _rejectFunction.push(f);
      callReject();
    }
    return _scope;
  }

  _scope.finally = function(f) {
    if (_finallyFunction.indexOf(f) === -1) {
      _finallyFunction.push(f);
      callFinally();
    }
    return _scope;
  }

  function callResolve(resolveData) {
    if (!_calledResolve) return;
    while (_resolveFunction.length > 0) _resolveFunction.shift()(resolveData);
  }

  function callReject(rejectData) {
    if (!_calledReject) return;
    while (_rejectFunction.length > 0) _rejectFunction.shift()(rejectData);
  }
  
  function callFinally() {
    if (!_calledFinally) return;
    while (_finallyFunction.length > 0) _finallyFunction.shift()();
  }
});
