require("../../NameSpace.js");

createClass(ASJSUtils, "WS", ASJS.EventDispatcher, function(_scope) {
  var priv = {};

  cnst(priv, "RECONNECT_INTERVALS", [1, 2, 3, 15, 30, 60, 120, 240, 300]);

  var _reconnectCounter = 0;
  var _tryToReconnect;
  var _reconnectTimeoutId;
  var _url;
  var _ws;

  get(_scope, "url", function() { return _url; });

  get(_scope, "isOpen", function() { return _scope.readyState === ASJSUtils.WS.OPEN; });

  get(_scope, "readyState", function() { return _ws ? _ws.readyState : ASJSUtils.WS.CLOSED; });

  get(_scope, "protocol", function() { return _ws ? _ws.protocol : null; });

  get(_scope, "bufferedAmount", function() { return _ws ? _ws.bufferedAmount : 0; });

  prop(_scope, "tryToReconnect", {
    get: function() { return _tryToReconnect; },
    set: function(v) { _tryToReconnect = v; }
  });

  _scope.connect = function(url) {
    _url = url;

    if (_ws) {
      if (_scope.isOpen) _ws.close();
      _ws = null;
    }

    _ws = new WebSocket(_url);
    _ws.onopen = onOpen;
    _ws.onclose = onClose;
    _ws.onmessage = onMessage;
    _ws.onerror = onError;
  }

  _scope.send = function(data) {
    if (_scope.isOpen) _ws.send(data);
  }

  _scope.close = function() {
    if (_scope.isOpen) _ws.close();
  }

  function onOpen(e) {
    _reconnectCounter = 0;
    _scope.dispatchEvent(ASJSUtils.WS.ON_OPEN);
  }

  function onClose(e) {
    _scope.dispatchEvent(ASJSUtils.WS.ON_CLOSED);
    if (!e.wasClean && _scope.tryToReconnect) {
      _reconnectCounter = Math.min(priv.RECONNECT_INTERVALS.length - 1, _reconnectCounter + 1);
      var timeout = priv.RECONNECT_INTERVALS[_reconnectCounter];
      _scope.dispatchEvent(ASJSUtils.WS.ON_RECONNECT, timeout);
      _reconnectTimeoutId = clearTimeout(_reconnectTimeoutId);
      _reconnectTimeoutId = setTimeout(reconnect, timeout * 1000);
    }
  }

  function reconnect() {
    _reconnectTimeoutId = clearTimeout(_reconnectTimeoutId);
    _scope.connect(_url);
  }

  function onMessage(e) {
    _scope.dispatchEvent(ASJSUtils.WS.ON_MESSAGE, e.data);
  }

  function onError(e) {
    _scope.dispatchEvent(ASJSUtils.WS.ON_ERROR, e);
  }
});
cnst(ASJSUtils.WS, "CONNECTING",   0);
cnst(ASJSUtils.WS, "OPEN",         1);
cnst(ASJSUtils.WS, "CLOSING",      2);
cnst(ASJSUtils.WS, "CLOSED",       3);
msg(ASJSUtils.WS, "ON_OPEN");
msg(ASJSUtils.WS, "ON_CLOSED");
msg(ASJSUtils.WS, "ON_ERROR");
msg(ASJSUtils.WS, "ON_MESSAGE");
msg(ASJSUtils.WS, "ON_RECONNECT");
