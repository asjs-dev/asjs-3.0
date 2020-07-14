require("../NameSpace.js");

createClass(WebGl, "Texture", ASJS.EventDispatcher, function(_scope, _super) {
  var _wglUtils = WebGl.Utils.instance;

  var _gl;
  var _target;
  var _textureLoader;
  var _source;
  var _texture;

  var _loaded = false;

  _scope.new = function(gl, source) {
    _textureLoader = new ASJS.Image();

    _gl = gl;

    _scope.wrapS = gl.CLAMP_TO_EDGE;
    _scope.wrapT = gl.CLAMP_TO_EDGE;
    _scope.minFilter = gl.NEAREST;
    _scope.magFilter = gl.NEAREST;

    _scope.source = source;

    _target = _gl.TEXTURE_2D;
    _texture = _gl.createTexture();
  }

  get(_scope, "loaded",  function() { return _loaded; });
  get(_scope, "target",  function() { return _target; });
  get(_scope, "texture", function() { return _texture; });

  prop(_scope, "source", {
    get: function() { return _source; },
    set: function(v) {
      _source = v;
      tis(_source, "string")
        ? loadTexture()
        : bindTexture();
    }
  });

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _textureLoader.removeEventListener(ASJS.LoaderEvent.LOAD, onTextureLoaded);
    _textureLoader.destruct();

    _gl            =
    _target        =
    _texture       =
    _loaded        =
    _textureLoader =
    _source        = null;

    _super.destruct();
  }

  function bindTexture() {
    _wglUtils.bindTexture2DSource(_gl, _scope);
  }

  function loadTexture() {
    _loaded = false;

    _textureLoader.removeEventListener(ASJS.LoaderEvent.LOAD, onTextureLoaded);
    _textureLoader.addEventListener(ASJS.LoaderEvent.LOAD, onTextureLoaded);

    _textureLoader.src = _source;
  }

  function onTextureLoaded() {
    _textureLoader.removeEventListener(ASJS.LoaderEvent.LOAD, onTextureLoaded);

    _source = _textureLoader.el;

    bindTexture();

    _loaded = true;

    _scope.dispatchEvent(ASJS.LoaderEvent.LOAD);
  }
});
