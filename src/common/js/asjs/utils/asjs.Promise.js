ASJS.Promise = createClass(
"Promise",
ASJS.BaseClass,
function(_scope, _super) {
  var _resolveFunction = [];
  var _rejectFunction  = [];
  var _finallyFunction = [];
  var _calledResolve   = false;
  var _calledReject    = false;
  var _calledFinally   = false;

  var _rejectData;
  var _resolveData;

  _scope.resolve = function(data) {
    _calledResolve = true;
    _calledFinally = true;
    _resolveData = data;
    callResolve();
    callFinally();
  }

  _scope.reject = function(data) {
    _calledReject = true;
    _calledFinally = true;
    _rejectData = data;
    callReject();
    callFinally();
  }

  _scope.then = function(f) {
    if (!_resolveFunction.has(f)) {
      _resolveFunction.push(f);
      callResolve();
    }
    return _scope;
  }

  _scope.catch = function(f) {
    if (!_rejectFunction.has(f)) {
      _rejectFunction.push(f);
      callReject();
    }
    return _scope;
  }

  _scope.finally = function(f) {
    if (!_finallyFunction.has(f)) {
      _finallyFunction.push(f);
      callFinally();
    }
    return _scope;
  }

  _scope.destruct = function() {
    _resolveFunction = null;
    _rejectFunction  = null;
    _finallyFunction = null;
    _calledResolve   = null;
    _calledReject    = null;
    _calledFinally   = null;
    
    _super.destruct();
  }

  function callResolve() {
    if (!_calledResolve) return;
    while (_resolveFunction.length > 0) _resolveFunction.shift()(_resolveData);
  }

  function callReject() {
    if (!_calledReject) return;
    while (_rejectFunction.length > 0) _rejectFunction.shift()(_rejectData);
  }

  function callFinally() {
    if (!_calledFinally) return;
    while (_finallyFunction.length > 0) _finallyFunction.shift()(_resolveData || _rejectData);
    _scope.destruct();
  }
});
