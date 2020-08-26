(function() {
  createUtility(ASJS, "Polyfill");

  var vendors = ["ms", "moz", "webkit", "o"];

  /* Fullscreen */
  document.isFullscreen = function() {
    return document.fullScreen || document.fullscreen ||
           document.webkitFullScreen || document.webkitFullscreen ||
           document.mozFullScreen || document.mozFullscreen ||
           document.msFullScreen || document.msFullscreen;
  };

  document.isFullscreenEnabled = function() {
    return document.fullScreenEnabled || document.fullscreenEnabled ||
           document.webkitSupportsFullScreen || document.webkitSupportsFullscreen ||
           document.mozFullScreenEnabled || document.mozFullscreenEnabled ||
           document.msFullScreenEnabled || document.msFullscreenEnabled;
  }

  document.getFullscreenElement = function() {
    return document.fullScreenElement || document.fullscreenElement ||
           document.webkitCurrentFullScreenElement || document.webkitCurrentFullscreenElement ||
           document.mozFullScreenElement || document.mozFullscreenElement ||
           document.msFullScreenElement || document.msFullscreenElement;
  }

  document.exitFullscreen = document.exitFullScreen || document.exitFullscreen ||
                            document.webkitExitFullScreen || document.webkitExitFullscreen ||
                            document.mozCancelFullScreen || document.mozCancelFullscreen ||
                            document.msExitFullScreen || document.msExitFullscreen;

  var elementPrototype = Element.prototype;
  elementPrototype.requestFullscreen = elementPrototype.requestFullScreen || elementPrototype.requestFullscreen ||
                                       elementPrototype.webkitRequestFullScreen || elementPrototype.webkitRequestFullscreen ||
                                       elementPrototype.webkitEnterFullScreen || elementPrototype.webkitEnterFullscreen ||
                                       elementPrototype.mozRequestFullScreen || elementPrototype.mozRequestFullscreen ||
                                       elementPrototype.msRequestFullScreen || elementPrototype.msRequestFullscreen;

  /* CSS prefix */
  var jsCssMap = {
    "Webkit" : "-webkit-",
    "Moz"    : "-moz-",
    "ms"     : "-ms-",
    "O"      : "-o-"
  };

  var style = document.createElement("p").style;
  var testProp = "Transform";

  var stylePrefixJS  = "";
  var stylePrefixCSS = "";
  for (var key in jsCssMap) {
    if ((key + testProp) in style) {
      stylePrefixJS = key;
      stylePrefixCSS = jsCssMap[key];
      break;
    }
  }

  if (stylePrefixJS === "Webkit" && "msHyphens" in style) {
    stylePrefixJS  = "ms";
    stylePrefixCSS = jsCssMap.ms;
  }

  cnst(ASJS.Polyfill, "stylePrefixJS",  stylePrefixJS);
  cnst(ASJS.Polyfill, "stylePrefixCSS", stylePrefixCSS);

  /* Endian */
  var b = new ArrayBuffer(4);
  var a = new Uint32Array(b);
  var c = new Uint8Array(b);
  a[0] = 0xdeadbeef;
  cnst(ASJS.Polyfill, "isLittleEndian", c[0] == 0xef);

  /* Function name */
  function functionNameTest() {}

  if (!functionNameTest.name || !tis(functionNameTest, "string")) {
    prop(Function.prototype, "name", {
      get: function() {
        var matches = this.toString().match(/^function\s*([^\s(]+)/);
        return matches
          ? matches[1]
          : null;
      }
    });
  }

  /* UserMedia */
  for (var x = 0; x < vendors.length && !window.navigator.getUserMedia; ++x) {
    window.navigator.getUserMedia = window.navigator[vendors[x] + "GetUserMedia"];
  }
  !window.navigator.getUserMedia && trace("window.navigator.getUserMedia is not supported!");

  /* URL */
  window.URL = window.URL || window.webkitURL;
  !window.URL && trace("window.URL is not supported!");

  /* AudioContext */
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  !window.AudioContext && trace("window.AudioContext is not supported!");

  /* MediaSource */
  window.MediaSource = window.MediaSource || window.WebKitMediaSource;
  !window.MediaSource && trace("window.MediaSource is not supported!");

  /* CustomEvent */
  if (!tis(window.CustomEvent, "function")) {
    function CustomEvent(evt, p) {
      p = p || {
        "bubbles": true,
        "cancelable": true,
        "detail": undefined
      };
      if (empty(p.bubbles)) p.bubbles = true;
      var e = document.createEvent("CustomEvent");
      e.initCustomEvent(evt, p.bubbles, p.cancelable, p.detail);
      return e;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  }

  /* Visibility */
  var polyfillVisibilitychange = "";
  var polyfillHidden           = "";

  var visibilitychangeText = "visibilitychange";
  var hiddenText           = "Hidden";
  var hiddenTextLower      = hiddenText.toLowerCase();

  if (document[hiddenTextLower] !== undefined) {
    polyfillHidden = hiddenTextLower;
    polyfillVisibilitychange = visibilitychangeText;
  } else if (document[vendors[0] + hiddenText] !== undefined) {
    polyfillHidden = vendors[0] + hiddenText;
    polyfillVisibilitychange = vendors[0] + visibilitychangeText;
  } else if (document[vendors[2] + hiddenText] !== undefined) {
    polyfillHidden = vendors[2] + hiddenText;
    polyfillVisibilitychange = vendors[2] + visibilitychangeText;
  }

  get(ASJS.Polyfill, visibilitychangeText, function() { return polyfillVisibilitychange; });
  get(ASJS.Polyfill, "document" + hiddenText,   function() { return document[polyfillHidden]; });

  /* Math.sign */
  Math.sign = Math.sign || function(x) {
    return ((x > 0) - (x < 0)) || +x;
  };

  function initDocument() {
    /* Scrollbar size */
    var containerSize = 20;

    var body = document.body;

    var container = document.createElement("div");
        container.style.width =
        container.style.height = containerSize + "px";
        container.style.overflow = "auto";

    var content = document.createElement("div");
        content.style.width  = "100%";
        content.style.height = (containerSize + 1) + "px";

    container.appendChild(content);

    body.appendChild(container);
    cnst(ASJS.Polyfill, "scrollBarSize", containerSize - content.offsetWidth);
    body.removeChild(container);

    container.removeChild(content);
    container =
    content   = null;
  }

  isDocumentComplete()
    ? initDocument()
    : document.addEventListener(ASJS.DocumentEvent.READY_STATE_CHANGE, function listener() {
        isDocumentComplete() &&
        initDocument() &&
        document.removeEventListener(ASJS.DocumentEvent.READY_STATE_CHANGE, listener);
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
    return ASJS.Point.create(
      event.wheelDeltaX || event.deltaX || (event.detail * ASJS.Polyfill.SCROLL_DELTA.X[event.axis]),
      event.wheelDeltaY || event.deltaY || (event.detail * ASJS.Polyfill.SCROLL_DELTA.Y[event.axis])
    );
  });
})();
