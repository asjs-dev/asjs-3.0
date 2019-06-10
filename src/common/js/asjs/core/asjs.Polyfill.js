createSingletonClass(ASJS, "Polyfill", ASJS.BaseClass, function(_scope) {
  var _vendors = ['ms', 'moz', 'webkit', 'o'];
  var _doc     = document;
  var _win     = window;

  var _workerCallbacksNum = 0;
  var _workerCallbacks = {};
  var _worker;

  var _isLittleEndian = false;

  var _visibilityPolyfill = {
    "visibilitychange" : "",
    "hidden"           : ""
  };

  var _eventPolyfill = {
    "dispatchEvent"       : "dispatchEvent",
    "addEventListener"    : "addEventListener",
    "removeEventListener" : "removeEventListener"
  };

  var _eventTypePrefix = "";
  var _stylePrefixJS   = "";
  var _stylePrefixCSS  = "";
  var _sid             = {};

  _scope.new = function() {
    checkWorker();
    checkSetTimeout();
    checkVisibility();
    checkCustomEvent();
    checkEventListeners();
    checkAnimationFrame();
    checkNavigator();
    checkAudioContext();
    checkUserMedia();
    checkURL();
    checkFullscreenEnabled();
    checkFunctionName();
    checkMediaSource();
    checkCSSPrefix();
    checkEndian();
    checkArray();
  }

  get(_scope, "isLittleEndian", function() { return _isLittleEndian; });

  get(_scope, "visibilitychange", function() { return _visibilityPolyfill.visibilitychange; });
  get(_scope, "documentHidden", function() { return document[_visibilityPolyfill.hidden]; });

  get(_scope, "eventTypePrefix", function() { return _eventTypePrefix; });

  get(_scope, "stylePrefixJS", function() { return _stylePrefixJS; });

  get(_scope, "stylePrefixCSS", function() { return _stylePrefixCSS; });

  _scope.convertEventType = function(type) {
    if (type.indexOf(_eventTypePrefix) !== 0) return _eventTypePrefix + type;
    return type;
  }

  _scope.dispatchEvent = function(element, event) {
    element[_eventPolyfill.dispatchEvent](event);
  }

  _scope.addEventListener = function(element, event, listener, capture) {
    element[_eventPolyfill.addEventListener](event, listener, capture);
  }

  _scope.removeEventListener = function(element, event, listener) {
    element[_eventPolyfill.removeEventListener](event, listener);
  }

  function addWorkerCallback(callback) {
    var newId = ++_workerCallbacksNum;
    if (!_workerCallbacks[newId]) {
      _workerCallbacks[newId] = callback;
      return newId;
    }
    return -1;
  }

  function removeWorkerCallback(callback) {
    removeWorkerCallbackById(getWorkerCallbackId(callback));
  }

  function removeWorkerCallbackById(id) {
    del(_workerCallbacks, id);
  }

  function getWorkerCallbackId(callback) {
    var id = -1;
    map(_workerCallbacks, function(key, item) {
      if (item === callback) id = key;
    });
    return id;
  }

  function checkWorker() {
    if (typeof Worker !== "undefined") {
      try {
        _worker = new Worker("data:text/javascript;charset=US-ASCII,setInterval(function(){postMessage(\"tick\");},1);");
        _worker.onmessage = function() {
          map(_workerCallbacks, function(key, item) {
            item();
          });
        };
      } catch (e) {
        _worker = null;
      }
    }
  }

  function checkSetTimeout() {
    if (_worker) {
      _win.setTimeout = function(callback, timeInterval) {
        var t = Date.now();
        var timerCallback = function() {
          if (Date.now() - t >= timeInterval) {
            removeWorkerCallback(timerCallback);
            callback();
          }
        };
        return addWorkerCallback(timerCallback);
      };

      _win.clearTimeout = removeWorkerCallbackById;

      _win.setInterval = function(callback, timeInterval) {
        var t = Date.now();
        var timerCallback = function() {
          var n = Date.now();
          if (n - t >= timeInterval) {
            t = n;
            callback();
          }
        };
        return addWorkerCallback(timerCallback);
      }

      _win.clearInterval = removeWorkerCallbackById;
    }
  }

  function checkVisibility() {
    if (typeof document.hidden !== "undefined") {
      _visibilityPolyfill.hidden = "hidden";
      _visibilityPolyfill.visibilitychange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      _visibilityPolyfill.hidden = "msHidden";
      _visibilityPolyfill.visibilitychange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      _visibilityPolyfill.hidden = "webkitHidden";
      _visibilityPolyfill.visibilitychange = "webkitvisibilitychange";
    }
  }

  function checkCustomEvent() {
    if (tis(_win.CustomEvent, "function")) return false;
    trace("window.CustomEvent is not supported, but replaceable");

    function CustomEvent(evt, p) {
      p = p || { bubbles: true, cancelable: true, detail: undefined };
      if (empty(p.bubbles)) p.bubbles = true;
      var e = _doc.createEvent('CustomEvent');
      e.initCustomEvent(evt, p.bubbles, p.cancelable, p.detail);
      return e;
    }

    CustomEvent.prototype = _win.Event.prototype;

    _win.CustomEvent = CustomEvent;
  };

  function checkAnimationFrame() {
    var lastTime = 0;
    for (var x = 0; x < _vendors.length && !_win.requestAnimationFrame; ++x) {
      _win.requestAnimationFrame = _win[_vendors[x] + 'RequestAnimationFrame'];
      _win.cancelAnimationFrame = _win[_vendors[x] + 'CancelAnimationFrame'] || _win[_vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!_win.requestAnimationFrame) {
      trace("window.requestAnimationFrame is not supported, but replaceable");
      _win.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = _win.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    var raf = _win.requestAnimationFrame;
    _win.requestAnimationFrame = function(callback) {
      if (_scope.documentHidden) return _win.setTimeout(callback, 1);
      return raf(callback);
    }

    if (!_win.cancelAnimationFrame) {
      trace("window.cancelAnimationFrame is not supported, but replaceable");
      _win.cancelAnimationFrame = function(id) {
        _win.clearTimeout(id);
      };
    }
  };

  function checkNavigator() {
    if (!_win.navigator) _win.navigator = navigator;
    if (!_win.navigator) trace("window.navigator is not supported!");
  };

  function checkAudioContext() {
    if (!_win.AudioContext) _win.AudioContext = _win.webkitAudioContext;
    if (!_win.AudioContext) trace("window.AudioContext is not supported!");
  };

  function checkUserMedia() {
    for (var x = 0; x < _vendors.length && !_win.navigator.getUserMedia; ++x) {
      _win.navigator.getUserMedia = _win.navigator[_vendors[x] + 'GetUserMedia'];
    }
    if (!_win.navigator.getUserMedia) trace("window.navigator.getUserMedia is not supported!");
  };

  function checkURL() {
    if (!_win.URL) _win.URL = _win.webkitURL;
    if (!_win.URL) trace("window.URL is not supported!");
  };

  function checkFullscreenEnabled() {
    var api;
    var vendor;
    var apis = {
      w3: {
        fullscreen : "fullScreen",
        enabled    : "fullscreenEnabled",
        element    : "fullscreenElement",
        request    : "requestFullscreen",
        exit       : "exitFullscreen",
        events: {
          change : "fullscreenchange",
          error  : "fullscreenerror"
        }
      },
      webkit: {
        fullscreen : "webkitFullScreen",
        enabled    : "webkitFullscreenEnabled",
        element    : "webkitCurrentFullScreenElement",
        request    : "webkitRequestFullscreen",
        exit       : "webkitExitFullscreen",
        events: {
          change : "webkitfullscreenchange",
          error  : "webkitfullscreenerror"
        }
      },
      moz: {
        fullscreen : "mozFullScreen",
        enabled    : "mozFullScreenEnabled",
        element    : "mozFullScreenElement",
        request    : "mozRequestFullScreen",
        exit       : "mozCancelFullScreen",
        events: {
          change : "mozfullscreenchange",
          error  : "mozfullscreenerror"
        }
      },
      ms: {
        fullscreen : "msFullScreen",
        enabled    : "msFullscreenEnabled",
        element    : "msFullscreenElement",
        request    : "msRequestFullscreen",
        exit       : "msExitFullscreen",
        events: {
          change : "MSFullscreenChange",
          error  : "MSFullscreenError"
        }
      }
    };
    var w3 = apis.w3;

    for (vendor in apis) {
      if (apis[vendor].enabled in _doc) {
        api = apis[vendor];
        break;
      }
    }

    if (!(w3.enabled in _doc) && api) {
      _doc["fullscreenEnabled"] = _doc[api.enabled];
      _doc["fullscreen"]        = _doc[api.fullscreen];
      _doc["fullscreenElement"] = _doc[api.element];
      _doc["exitFullscreen"]    = _doc[api.exit];

      Element.prototype.requestFullscreen = Element.prototype[api.request];
    }
  };

  function checkFunctionName() {
    if (checkFunctionName.name && tis(checkFunctionName.name, "string")) return;
    prop(Function.prototype, "name", {
      get: function() {
        var matches = _scope.toString().match(/^function\s*([^\s(]+)/);
        if (matches) return matches[1];
        return null;
      }
    });
  }

  function checkEventListeners() {
    var p = _doc.createElement("p");

    if (p.addEventListener) return;

    _eventPolyfill.addEventListener    = "attachEvent";
    _eventPolyfill.removeEventListener = "detachEvent";
    _eventPolyfill.dispatchEvent       = "fireEvent";

    _eventTypePrefix = "on";
  }

  function checkMediaSource() {
    if (!_win.MediaSource) _win.MediaSource = _win.WebKitMediaSource;
    if (!_win.MediaSource) trace("window.MediaSource is not supported!");
  }

  function checkCSSPrefix() {
    var jsCssMap = {
      Webkit : '-webkit-',
      Moz    : '-moz-',
      ms     : '-ms-',
      O      : '-o-'
    };

    var style = document.createElement('p').style;
    var testProp = 'Transform';

    for (var key in jsCssMap) {
      if ((key + testProp) in style) {
        _stylePrefixJS = key;
        _stylePrefixCSS = jsCssMap[key];
        break;
      }
    }

    if (_stylePrefixJS === 'Webkit' && 'msHyphens' in style) {
      _stylePrefixJS = 'ms';
      _stylePrefixCSS = jsCssMap.ms;
    }
  }

  function checkEndian() {
    var b = new ArrayBuffer(4);
    var a = new Uint32Array(b);
    var c = new Uint8Array(b);
    a[0] = 0xdeadbeef;
    _isLittleEndian = c[0] == 0xef;
  }

  function checkArray() {
    Array.prototype.has = function(item) {
      return this.indexOf(item) > -1;
    }
    Array.prototype.remove = function(item) {
      this.has(item) && this.splice(this.indexOf(item), 1);
    }
  }
});
cnst(ASJS.Polyfill, "SCROLL_SIZE", -20);
cnst(ASJS.Polyfill, "SCROLL_DELTA", {
  "X": {
    "1": ASJS.Polyfill.SCROLL_SIZE,
    "2": 0
  },
  "Y": {
    "1": 0,
    "2": ASJS.Polyfill.SCROLL_SIZE
  }
});
rof(ASJS.Polyfill, "getScrollData", function(event) {
  return new ASJS.Point(
    event.wheelDeltaX || event.deltaX || (event.detail * ASJS.Polyfill.SCROLL_DELTA.X[event.axis]),
    event.wheelDeltaY || event.deltaY || (event.detail * ASJS.Polyfill.SCROLL_DELTA.Y[event.axis])
  );
});
