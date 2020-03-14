createSingletonClass(ASJS, "Polyfill", ASJS.BaseClass, function(_scope) {
  var _vendors = ['ms', 'moz', 'webkit', 'o'];

  var _workerCallbacksNum = 0;
  var _workerCallbacks = {};
  var _worker;

  var _isLittleEndian = false;

  var _visibilityPolyfill = {
    "visibilitychange" : "",
    "hidden"           : ""
  };

  var _stylePrefixJS   = "";
  var _stylePrefixCSS  = "";
  var _sid             = {};

  var _scrollBarSize = 0;

  _scope.new = function() {
    checkWorker();
    checkSetTimeout();
    checkVisibility();
    checkCustomEvent();
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
    checkScrollbarSize();
  }

  get(_scope, "isLittleEndian",   function() { return _isLittleEndian; });
  get(_scope, "visibilitychange", function() { return _visibilityPolyfill.visibilitychange; });
  get(_scope, "documentHidden",   function() { return document[_visibilityPolyfill.hidden]; });
  get(_scope, "stylePrefixJS",    function() { return _stylePrefixJS; });
  get(_scope, "stylePrefixCSS",   function() { return _stylePrefixCSS; });
  get(_scope, "scrollBarSize",    function() { return _scrollBarSize; });

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
      window.setTimeout = function(callback, timeInterval) {
        var t = Date.now();
        var timerCallback = function() {
          if (Date.now() - t >= timeInterval) {
            removeWorkerCallback(timerCallback);
            callback();
          }
        };
        return addWorkerCallback(timerCallback);
      };

      window.clearTimeout = removeWorkerCallbackById;

      window.setInterval = function(callback, timeInterval) {
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

      window.clearInterval = removeWorkerCallbackById;
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
    if (tis(window.CustomEvent, "function")) return false;
    trace("window.CustomEvent is not supported, but replaceable");

    function CustomEvent(evt, p) {
      p = p || { bubbles: true, cancelable: true, detail: undefined };
      if (empty(p.bubbles)) p.bubbles = true;
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(evt, p.bubbles, p.cancelable, p.detail);
      return e;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  };

  function checkAnimationFrame() {
    var lastTime = 0;
    for (var x = 0; x < _vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[_vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[_vendors[x] + 'CancelAnimationFrame'] || window[_vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      trace("window.requestAnimationFrame is not supported, but replaceable");
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    var raf = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
      if (_scope.documentHidden) return window.setTimeout(callback, 1);
      return raf(callback);
    }

    if (!window.cancelAnimationFrame) {
      trace("window.cancelAnimationFrame is not supported, but replaceable");
      window.cancelAnimationFrame = window.clearTimeout;
    }
  };

  function checkNavigator() {
    if (!window.navigator) window.navigator = navigator;
    if (!window.navigator) trace("window.navigator is not supported!");
  };

  function checkAudioContext() {
    if (!window.AudioContext) window.AudioContext = window.webkitAudioContext;
    if (!window.AudioContext) trace("window.AudioContext is not supported!");
  };

  function checkUserMedia() {
    for (var x = 0; x < _vendors.length && !window.navigator.getUserMedia; ++x) {
      window.navigator.getUserMedia = window.navigator[_vendors[x] + 'GetUserMedia'];
    }
    if (!window.navigator.getUserMedia) trace("window.navigator.getUserMedia is not supported!");
  };

  function checkURL() {
    if (!window.URL) window.URL = window.webkitURL;
    if (!window.URL) trace("window.URL is not supported!");
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
      if (apis[vendor].enabled in document) {
        api = apis[vendor];
        break;
      }
    }

    if (!(w3.enabled in document) && api) {
      document["fullscreenEnabled"] = document[api.enabled];
      document["fullscreen"]        = document[api.fullscreen];
      document["fullscreenElement"] = document[api.element];
      document["exitFullscreen"]    = document[api.exit];

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

  function checkMediaSource() {
    if (!window.MediaSource) window.MediaSource = window.WebKitMediaSource;
    if (!window.MediaSource) trace("window.MediaSource is not supported!");
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
      var index = this.indexOf(item);
      index > -1 && this.splice(index, 1);
    }
  }

  function checkScrollbarSize() {
    var d = document;
    var containerSize = 20;

    var container = d.createElement("div");
        container.style.width =
        container.style.height = containerSize + "px";
        container.style.overflow = "auto";

    var content = d.createElement("div");
        content.style.width = "100%";
        content.style.height = (containerSize + 1) + "px";

    container.appendChild(content);

    d.body.appendChild(container);
    _scrollBarSize = containerSize - content.offsetWidth;
    d.body.removeChild(container);

    container.removeChild(content);
    container =
    content   = null;
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
