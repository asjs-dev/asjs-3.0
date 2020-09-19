createClass(ASJS, "Promise", BaseClass, function(_scope, _super) {
  var _resolveFunction = [];
  var _rejectFunction  = [];
  var _finallyFunction = [];
  var _calledResolve   = false;
  var _calledReject    = false;
  var _calledFinally   = false;

  var _destructRequired = false;

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
    if (!inArray(_resolveFunction, f)) {
      _resolveFunction.push(f);
      callResolve();
    }
    return _scope;
  }

  _scope.catch = function(f) {
    if (!inArray(_rejectFunction, f)) {
      _rejectFunction.push(f);
      callReject();
    }
    return _scope;
  }

  _scope.finally = function(f) {
    if (!inArray(_finallyFunction, f)) {
      _finallyFunction.push(f);
      callFinally();
    }
    return _scope;
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    if (
      (_resolveFunction && _resolveFunction.length > 0) ||
      (_rejectFunction  && _rejectFunction.length  > 0) ||
      (_finallyFunction && _finallyFunction.length > 0)
    ) _destructRequired = true;
    else {
      _resolveFunction =
      _rejectFunction  =
      _finallyFunction =
      _calledResolve   =
      _calledReject    =
      _calledFinally   = null;

      _super.destruct();
    }
  }

  function callResolve() {
    if (!_calledResolve) return;
    while (_resolveFunction && _resolveFunction.length > 0) _resolveFunction.shift()(_resolveData);
    if (_destructRequired) _scope.destruct();
  }

  function callReject() {
    if (!_calledReject) return;
    while (_rejectFunction && _rejectFunction.length > 0) _rejectFunction.shift()(_rejectData);
    if (_destructRequired) _scope.destruct();
  }

  function callFinally() {
    if (!_calledFinally) return;
    while (_finallyFunction && _finallyFunction.length > 0) _finallyFunction.shift()(_resolveData || _rejectData);
    if (_destructRequired) _scope.destruct();
  }
});
rof(ASJS.Promise, "all", function(promises) {
  var dfd = new ASJS.Promise();

  var responses = [];
  var i = -1;
  var l = promises.length;
  while (++i < l) {
    var promise = promises[i];
        promise.finally(function(promise, response) {
          promise.destruct();
          promise = null;

          responses.push(response);
          if (responses.length === promises.length) dfd.resolve(responses);
        }.bind(this, promise));
  }

  return dfd;
});
rof(ASJS.Promise, "race", function(promises) {
  var dfd = new ASJS.Promise();

  var hadResponse = false;
  var i = -1;
  var l = promises.length;
  while (++i < l) {
    promises[i].finally(function(response) {
      !hadResponse && dfd.resolve(response);
      hadResponse = true;
      i = l;

      var j = -1;
      while (++j < l) {
        promises[i] && promises[i].destruct && promises[i].destruct();
        promises[i] = null;
      }
    });
  }

  return dfd;
});
