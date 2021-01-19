require("../NameSpace.js");
require("../utils/agl.Utils.js");
require("../data/props/agl.ColorProps.js");

AGL.RendererHelper = {};

AGL.RendererHelper.initRenderer = function(config) {
  helpers.deepFreeze(config);

  this.clearColor = new AGL.ColorProps();

  this._width                     =
  this._height                    =
  this.widthHalf                  =
  this.heightHalf                 =
  this._sizeUpdateId              =
  this._currentSizeUpdateId       =
  this._renderTime                =
  this._currentClearColorUpdateId = 0;

  this._config = config;
  this._canvas = config.canvas;

  //this._loseContextExt =
  this._vertexShader   =
  this._fragmentShader =
  this._program        =
  this._context        = null;
  /*
  this._onContextLostBind     = this._onContextLost.bind(this);
  this._onContextRestoredBind = this._onContextRestored.bind(this);
  */
  this._init();
};

AGL.RendererHelper.initConfig = function(config, target) {
  config = AGL.CreateConfig(config);

  config.vertexShader   = config.vertexShader   || target.createVertexShader;
  config.fragmentShader = config.fragmentShader || target.createFragmentShader;

  config.locations = config.locations.concat([
    "aPos",
    "uTex"
  ]);

  return config;
}

AGL.RendererHelper.createRendererBody = function(_scope) {
  helpers.get(_scope, "canvas", function() { return this._canvas; });
  helpers.get(_scope, "isContextLost", function() {
    return this._context && this._context.isContextLost && this._context.isContextLost();
  });

  helpers.get(_scope, "context", function() {
    if (!this._context || this.isContextLost) {
      /*
      this._removeListeners();
      this._addListeners();
      */
      this._context = this._canvas.getContext("webgl2", this._config.contextAttributes);
    }
    return this._context;
  });

  helpers.property(_scope, "width", {
    get: function() { return this._width; },
    set: function(v) {
      if (this._width !== v) {
        this._width = v;
        ++this._sizeUpdateId;
      }
    }
  });

  helpers.property(_scope, "height", {
    get: function() { return this._height; },
    set: function(v) {
      if (this._height !== v) {
        this._height = v;
        ++this._sizeUpdateId;
      }
    }
  });

  _scope.clear = function() {
    var clearColorProps = this.clearColor;
    if (this._currentClearColorUpdateId < clearColorProps.updateId) {
      this._currentClearColorUpdateId = clearColorProps.updateId;
      this._gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
    }
    this._gl.clear(AGLC.COLOR_BUFFER_BIT);
  }

  _scope.setSize = function(width, height) {
    this.width  = width;
    this.height = height;
  }

  _scope.render = function() {
    this._preRender();
    this._render();
  }

  _scope._preRender = function() {
    this._renderTime = Date.now();
    this._resize();
  }

  _scope._render = helpers.emptyFunction;

  _scope._useBlendMode = function(blendMode) {
    this._gl[blendMode.eqName](
      blendMode.eqs[0],
      blendMode.eqs[1]
    );

    this._gl[blendMode.funcName](
      blendMode.funcs[0],
      blendMode.funcs[1],
      blendMode.funcs[2],
      blendMode.funcs[3]
    );
  }

  _scope._resizeCanvas = function() {
    if (this._currentSizeUpdateId < this._sizeUpdateId) {
      this._currentSizeUpdateId = this._sizeUpdateId;

      this._canvas.width  = this._width;
      this._canvas.height = this._height;

      this.widthHalf  = this._width  * .5;
      this.heightHalf = this._height * .5;

      this._gl.viewport(0, 0, this._width, this._height);

      return true;
    }
    return false;
  }

  _scope._resize = _scope._resizeCanvas;

  _scope._destructRenderer = function() {
    //this._removeListeners();

    //this._loseContextExt && this._loseContextExt.loseContext();

    this._destructContext();

    this.clearColor      =
    this._gl             =
    //this._loseContextExt =
    this._vertexShader   =
    this._fragmentShader =
    this._program        =
    this._locations      =
    this._config         =
    this._canvas         =
    this._context        = null;
  }
  /*
  _scope._addListeners = function() {
    this._canvas.addEventListener("webglcontextlost",        this._onContextLostBind);
    this._canvas.addEventListener("webglcontextrestored",    this._onContextRestoredBind);
  }

  _scope._removeListeners = function() {
    this._canvas.removeEventListener("webglcontextlost",     this._onContextLostBind);
    this._canvas.removeEventListener("webglcontextrestored", this._onContextRestoredBind);
  }
  */
  _scope._destructContext = function() {
    this._gl.useProgram(null);
    this._gl.detachShader(this._program, this._vertexShader);
    this._gl.deleteShader(this._vertexShader);
    this._gl.detachShader(this._program, this._fragmentShader);
    this._gl.deleteShader(this._fragmentShader);
    this._gl.deleteProgram(this._program);
  }

  _scope._createArrayBuffer = function(data, locationId, length, num, size, type, bytes) {
    var buffer = this._gl.createBuffer();

    this._gl.bindBuffer(AGLC.ARRAY_BUFFER, buffer);
		this._gl.bufferData(AGLC.ARRAY_BUFFER, data.byteLength, AGLC.DYNAMIC_DRAW);

    this._attachArrayBuffer(this._locations[locationId], buffer, data, length, num, size, type, bytes);

    return buffer;
  }

  _scope._attachArrayBuffer = function(location, buffer, data, length, num, size, type, bytes) {
    this._bindArrayBuffer(buffer, data);

		var stride = bytes * length;
    var i = num + 1;
    while (--i) {
			var loc = location + (num - i);
			this._gl.enableVertexAttribArray(loc);

      this._gl[
        "vertexAttrib" + (
          type === AGLC.FLOAT
          ? ""
          : "I"
        ) + "Pointer"
      ](loc, size, type, false, stride, (num - i) * bytes * size);
			this._gl.vertexAttribDivisor(loc, 1);
		}
	}

  _scope._bindArrayBuffer = function(buffer, data) {
    this._gl.bindBuffer(AGLC.ARRAY_BUFFER, buffer);
		this._gl.bufferSubData(AGLC.ARRAY_BUFFER, 0, data);
  }

  _scope._init = function() {
    this._gl = this.context;
    //this._loseContextExt = this._gl.getExtension('WEBGL_lose_context');
    this._gl.pixelStorei(AGLC.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    this._gl.enable(AGLC.BLEND);

    this._vertexShader   = AGL.Utils.loadVertexShader(this._gl,   this._config.vertexShader(this._config));
    this._fragmentShader = AGL.Utils.loadFragmentShader(this._gl, this._config.fragmentShader(this._config));
    this._program        = AGL.Utils.createProgram(this._gl, [this._vertexShader, this._fragmentShader]);
    this._locations      = AGL.Utils.getLocationsFor(this._gl, this._program, this._config.locations);
    this._gl.useProgram(this._program);

    var positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(AGLC.ARRAY_BUFFER, positionBuffer);
    this._gl.bufferData(
      AGLC.ARRAY_BUFFER,
      new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ]),
      AGLC.STATIC_DRAW
    );
    this._gl.vertexAttribPointer(this._locations.aPos, 2, AGLC.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations.aPos);

    this._initCustom();
  }

  _scope._initCustom = helpers.emptyFunction;
  /*
  _scope._onContextLost = function(event) {
    event.preventDefault();

    requestAnimationFrame(function() {
      this._loseContextExt && this._loseContextExt.restoreContext();
    }.bind(this));

  }

  _scope._onContextRestored = function(event) {
    this._init();
  }
  */
};

AGL.RendererHelper.createVersion = function(precision) {
  return "#version 300 es\nprecision " + precision + " float;\n";
}

AGL.RendererHelper.createGetTextureFunction = function(maxTextureImageUnits) {
  var func =
  "vec4 gtTexCol(float i,vec2 c){";

  for (var i = 0; i < maxTextureImageUnits; ++i) func +=
    (i > 0 ? "else " : "") + "if(i<" + (i + 1) + ".)return texture(uTex[" + i + "],c);";

  func +=
    "return vec4(0);" +
  "}";
  return func;
};

AGL.RendererHelper.getTexColor = "fgCol=gtTexCol(vTexId,vTexCrop.xy+vTexCrop.zw*mod(vTCrd,1.));";

AGL.RendererHelper.calcGlPositions =
  "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
  "mat3 tMt=mat3(aMt[1].zw,0,aMt[2].xy,0,aMt[2].zw,1);" +
  "vec3 pos=vec3(aPos,1);" +
  "gl_Position=vec4(mt*pos,1);" +
  "vTCrd=(tMt*pos).xy;" +
  "vTexCrop=aMt[3];";

AGL.RendererHelper.Precisons = {
  HIGH   : "highp",
  MEDIUM : "mediump",
  LOW    : "lowp"
};
