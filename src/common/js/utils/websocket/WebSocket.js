require("../../helpers/createClass.js");
require("../../helpers/property.js");
require("../../helpers/constant.js");
require("../../helpers/message.js");

require("../NameSpace.js");

helpers.createClass(ASJSUtils, "WS", ASJS.EventDispatcher, function(_scope) {
  var priv = {};

  helpers.constant(priv, "RECONNECT_INTERVALS", [1, 2, 3, 15, 30, 60, 120, 240, 300]);

  var _reconnectCounter = 0;
  var _reconnectTimeoutId;
  var _url;
  var _ws;

  _scope.tryToReconnect;

  helpers.get(_scope, "url", function() { return _url; });

  helpers.get(_scope, "isOpen", function() { return _scope.readyState === ASJSUtils.WS.OPEN; });

  helpers.get(_scope, "readyState", function() { return _ws ? _ws.readyState : ASJSUtils.WS.CLOSED; });

  helpers.get(_scope, "protocol", function() { return _ws ? _ws.protocol : null; });

  helpers.get(_scope, "bufferedAmount", function() { return _ws ? _ws.bufferedAmount : 0; });

  _scope.connect = function(url) {
    _url = url;

    if (_ws) {
      _scope.isOpen && _ws.close();
      _ws = null;
    }

    _ws = new WebSocket(_url);
    _ws.onopen = onOpen;
    _ws.onclose = onClose;
    _ws.onmessage = onMessage;
    _ws.onerror = onError;
  }

  _scope.send = function(data) {
    _scope.isOpen && _ws.send(data);
  }

  _scope.close = function() {
    _scope.isOpen && _ws.close();
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
      _reconnectTimeoutId = setTimeout(reconnect, timeout * 1e3);
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
helpers.constant(ASJSUtils.WS, "CONNECTING",   0);
helpers.constant(ASJSUtils.WS, "OPEN",         1);
helpers.constant(ASJSUtils.WS, "CLOSING",      2);
helpers.constant(ASJSUtils.WS, "CLOSED",       3);
helpers.message(ASJSUtils.WS, "ON_OPEN");
helpers.message(ASJSUtils.WS, "ON_CLOSED");
helpers.message(ASJSUtils.WS, "ON_ERROR");
helpers.message(ASJSUtils.WS, "ON_MESSAGE");
helpers.message(ASJSUtils.WS, "ON_RECONNECT");
