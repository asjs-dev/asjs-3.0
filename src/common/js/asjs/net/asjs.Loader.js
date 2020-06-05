require("../event/asjs.EventDispatcher.js");
require("../event/asjs.LoaderEvent.js");
require("../utils/asjs.LZW.js");
require("./asjs.RequestMethod.js");

createClass(ASJS, "Loader", ASJS.EventDispatcher, function(_scope, _super) {
  var _async           = true;
  var _method          = ASJS.RequestMethod.GET;
  var _responseType    = "text";
  var _compressed      = false;
  var _withCredentials = false;
  var _headers;
  var _request;
  var _username;
  var _password;
  var _url;
  var _data;
  var _content;
  var _promise;

  _scope.new = reset;

  get(_scope, "content", function() {
    if (!_content) {
      _content = _request.response;
      if (_compressed) _content = ASJS.LZW.decompress(_content);
      if (_responseType === "json" && tis(_request.response, "string")) _content = JSON.parse(_content);
    }
    return _content;
  });

  get(_scope, "status",          function() { return _request.status; });
  get(_scope, "statusText",      function() { return _request.statusText; });
  get(_scope, "readyState",      function() { return _request.readyState; });
  get(_scope, "url",             function() { return _url; });
  set(_scope, "contentType",     function(v) { _scope.setHeader("Content-type", v); });
  set(_scope, "username",        function(v) { _username = v; });
  set(_scope, "password",        function(v) { _password = v; });
  set(_scope, "data",            function(v) { _data = v; });
  set(_scope, "async",           function(v) { _async = v; });
  set(_scope, "method",          function(v) { _method = v; });
  set(_scope, "responseType",    function(v) { _responseType = v; });
  set(_scope, "compressed",      function(v) { _compressed = v; });
  set(_scope, "withCredentials", function(v) { _withCredentials = v; });

  _scope.unload = reset;

  _scope.setHeader = function(k, v) {
    if (!_headers) _headers = {};
    _headers[k] = v;
  };

  _scope.getHeader = function(k) {
    return _request.getRequestHeader(k);
  };

  _scope.cancel = function() {
    _request.abort();
  };

  _scope.load = function(url) {
    if (url) {
      _url = url;

      _request.withCredentials = _withCredentials;
      _request.open(_method, _url, _async, _username, _password);
      _request.responseType = _compressed ? "text" : _responseType;
      if (_headers) {
        for (var k in _headers) {
          _request.setRequestHeader(k, _headers[k]);
        }
      }
      _request.send(_compressed ? ASJS.LZW.compress(_data) : _data);
    }

    return _promise;
  };

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    if (_request) {
      _scope.cancel();
      removeListeners();
    }

    !emp(_promise) && _promise.destruct();

    _async        =
    _method       =
    _headers      =
    _responseType =
    _compressed   =
    _request      =
    _username     =
    _password     =
    _url          =
    _data         =
    _content      =
    _promise      = null;

    _super.destruct();
  }

  function reset() {
    if (_request) {
      _scope.cancel();
      removeListeners();
    }

    _content = null;

    !emp(_promise) && _promise.destruct();
    _promise = new ASJS.Promise();

    _request = XMLHttpRequest ? new XMLHttpRequest() : new XDomainRequest();

    _request.addEventListener(ASJS.LoaderEvent.READY_STATE_CHANGE, onReadyStateChange);
    _request.addEventListener(ASJS.LoaderEvent.PROGRESS,           onProgress);
    _request.addEventListener(ASJS.LoaderEvent.LOAD,               onLoad);
    _request.addEventListener(ASJS.LoaderEvent.ERROR,              onError);
    _request.addEventListener(ASJS.LoaderEvent.ABORT,              onAbort);
    _request.addEventListener(ASJS.LoaderEvent.LOAD_START,         onLoadStart);
    _request.addEventListener(ASJS.LoaderEvent.TIMEOUT,            onTimeout);
    _request.addEventListener(ASJS.LoaderEvent.LOAD_END,           onLoadEnd);
  }

  function removeListeners() {
    _request.removeEventListener(ASJS.LoaderEvent.READY_STATE_CHANGE, onReadyStateChange);
    _request.removeEventListener(ASJS.LoaderEvent.PROGRESS,           onProgress);
    _request.removeEventListener(ASJS.LoaderEvent.LOAD,               onLoad);
    _request.removeEventListener(ASJS.LoaderEvent.ERROR,              onError);
    _request.removeEventListener(ASJS.LoaderEvent.ABORT,              onAbort);
    _request.removeEventListener(ASJS.LoaderEvent.LOAD_START,         onLoadStart);
    _request.removeEventListener(ASJS.LoaderEvent.TIMEOUT,            onTimeout);
    _request.removeEventListener(ASJS.LoaderEvent.LOAD_END,           onLoadEnd);
  }

  function onReadyStateChange(e) {
    _scope.dispatchEvent && _scope.dispatchEvent(ASJS.LoaderEvent.READY_STATE_CHANGE, e);
  };

  function onLoadStart() {
    _scope.dispatchEvent && _scope.dispatchEvent(ASJS.LoaderEvent.LOAD_START);
  };

  function onProgress(e) {
    e.lengthComputable && _scope.dispatchEvent && _scope.dispatchEvent(ASJS.LoaderEvent.PROGRESS, e);
  };

  function onLoad(e) {
    if (_scope.status >= 400) onError(e);
    else {
      _promise.resolve(_scope);
      _scope.dispatchEvent && _scope.dispatchEvent(ASJS.LoaderEvent.LOAD, e);
    }
  };

  function onAbort(e) {
    _promise.reject();
    _scope.dispatchEvent && _scope.dispatchEvent(ASJS.LoaderEvent.ABORT, e);
  };

  function onTimeout(e) {
    _promise.reject();
    _scope.dispatchEvent && _scope.dispatchEvent(ASJS.LoaderEvent.TIMEOUT, e);
  };

  function onLoadEnd(e) {
    _promise.reject();
    _scope.dispatchEvent && _scope.dispatchEvent(ASJS.LoaderEvent.LOAD_END, e);
  };

  function onError(e) {
    _promise.reject();
    _scope.dispatchEvent && _scope.dispatchEvent(ASJS.LoaderEvent.ERROR, e);
  };
});
