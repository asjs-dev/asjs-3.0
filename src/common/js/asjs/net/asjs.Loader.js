require("./asjs.RequestMethod.js");
require("../event/asjs.EventDispatcher.js");
require("../event/asjs.LoaderEvent.js");
require("../utils/asjs.LZW.js");

ASJS.Loader = createClass(
"Loader",
ASJS.EventDispatcher,
function(_scope, _super) {
  var _async        = true;
  var _method       = ASJS.RequestMethod.GET;
  var _headers      = {};
  var _responseType = "text";
  var _compressed   = false;
  var _request;
  var _username;
  var _password;
  var _url;
  var _data;

  _scope.new = function() {
    reset();
  }

  get(_scope, "url", function() { return _url; });

  get(_scope, "content", function() {
    var response = _request.response;
    if (_compressed) response = ASJS.LZW.instance.decompress(response);
    if (_responseType === "json" && tis(_request.response, "string")) response = JSON.parse(response);
    return response;
  });

  get(_scope, "status", function() { return _request.status; });

  get(_scope, "statusText", function() { return _request.statusText; });

  get(_scope, "readyState", function() { return _request.readyState; });

  set(_scope, "contentType", function(v) { _headers["Content-type"] = v; });

  set(_scope, "username", function(v) { _username = v; });

  set(_scope, "password", function(v) { _password = v; });

  set(_scope, "data", function(v) { _data = v; });

  set(_scope, "async", function(v) { _async = v; });

  set(_scope, "method", function(v) { _method = v; });

  set(_scope, "responseType", function(v) { _responseType = v; });

  set(_scope, "compressed", function(v) { _compressed = v; });

  _scope.unload = function() {
    _scope.free();
  }

  _scope.setHeader = function(k, v) {
    _headers[k] = v;
  };

  _scope.getHeader = function(k) {
    return _request.getRequestHeader(k);
  };

  _scope.cancel = function() {
    _request.abort();
  };

  _scope.load = function(url) {
    if (!url) return;
    _url = url;

    _request.open(_method, _url, _async, _username, _password);
    _request.responseType = _responseType;
    for (var k in _headers) _request.setRequestHeader(k, _headers[k]);
    _request.send(_data);
  };

  _scope.free = function() {
    reset();
  }

  function reset() {
    if (_request) {
      _scope.cancel();
      _request = null;
    }

    _request = new XMLHttpRequest();

    if ("withCredentials" in _request) {
    } else if (!empty(XDomainRequest)) _request = new XDomainRequest();
    else _request = null;

    if (!_request) throw new Error("CORS not supported");
    _request.withCredentials = true;

    _request.addEventListener(ASJS.LoaderEvent.READY_STATE_CHANGE, onReadyStateChange);
    _request.addEventListener(ASJS.LoaderEvent.PROGRESS,           onProgress);
    _request.addEventListener(ASJS.LoaderEvent.LOAD,               onLoad);
    _request.addEventListener(ASJS.LoaderEvent.ERROR,              onError);
    _request.addEventListener(ASJS.LoaderEvent.ABORT,              onAbort);
    _request.addEventListener(ASJS.LoaderEvent.LOAD_START,         onLoadStart);
    _request.addEventListener(ASJS.LoaderEvent.TIMEOUT,            onTimeout);
    _request.addEventListener(ASJS.LoaderEvent.LOAD_END,           onLoadEnd);
  }

  function onReadyStateChange(e) {
    _scope.dispatchEvent(ASJS.LoaderEvent.READY_STATE_CHANGE, e);
  };

  function onLoadStart() {
    _scope.dispatchEvent(ASJS.LoaderEvent.LOAD_START);
  };

  function onProgress(e) {
    if (e.lengthComputable) _scope.dispatchEvent(ASJS.LoaderEvent.PROGRESS, e);
  };

  function onLoad(e) {
    if (_scope.status >= 400) onError(e);
    else _scope.dispatchEvent(ASJS.LoaderEvent.LOAD, e);
  };

  function onAbort(e) {
    _scope.dispatchEvent(ASJS.LoaderEvent.ABORT, e);
  };

  function onTimeout(e) {
    _scope.dispatchEvent(ASJS.LoaderEvent.TIMEOUT, e);
  };

  function onLoadEnd(e) {
    _scope.dispatchEvent(ASJS.LoaderEvent.LOAD_END, e);
  };

  function onError(e) {
    _scope.dispatchEvent(ASJS.LoaderEvent.ERROR, e);
  };
});
