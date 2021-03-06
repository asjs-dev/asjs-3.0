require("../NameSpace.js");
require("../utils/agl.Utils.js");
require("../data/props/agl.ColorProps.js");

AGL.RendererHelper = {};

AGL.RendererHelper.constructor = function(config) {
  /*
  this._vertexShader   =
  this._fragmentShader =
  this._program        =
  this._context        = null;
  */

  this.clearColor = new AGL.ColorProps();

  this.width                      =
  this.height                     = 1;

  this.widthHalf                  =
  this.heightHalf                 =
  this._renderTime                =
  this._currentClearColorUpdateId = 0;

  this._resizeFunc = this._resize;

  this._config = config;
  this._canvas = config.canvas;
  
  this._init();
};

AGL.RendererHelper.body = function(_scope) {
  helpers.get(_scope, "canvas", function() { return this._canvas; });
  helpers.get(_scope, "isContextLost", function() {
    return this._context && this._context.isContextLost && this._context.isContextLost();
  });

  helpers.get(_scope, "context", function() {
    if (!this._context || this.isContextLost)
      this._context = this._canvas.getContext("webgl2", this._config.contextAttributes);
    return this._context;
  });

  helpers.property(_scope, "width", {
    get: function() { return this._width; },
    set: function(v) {
      if (this._width !== v) {
        this._width = v;
        this._resizeFunc = this._resize;
      }
    }
  });

  helpers.property(_scope, "height", {
    get: function() { return this._height; },
    set: function(v) {
      if (this._height !== v) {
        this._height = v;
        this._resizeFunc = this._resize;
      }
    }
  });

  _scope.clear = function() {
    var clearColorProps = this.clearColor;
    if (this._currentClearColorUpdateId < clearColorProps.updateId) {
      this._currentClearColorUpdateId = clearColorProps.updateId;
      this._gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
    }
    this._gl.clear({{AGL.Const.COLOR_BUFFER_BIT}});
  }

  _scope.setSize = function(width, height) {
    this.width  = width;
    this.height = height;
  }

  _scope.render = function() {
    this._renderTime = Date.now();
    this._resizeFunc();
    this._render();
  }

  _scope._useBlendMode = function(blendMode) {
    var eqs   = blendMode.eqs;
    var funcs = blendMode.funcs;

    this._gl[blendMode.eqName](
      eqs[0],
      eqs[1]
    );

    this._gl[blendMode.funcName](
      funcs[0],
      funcs[1],
      funcs[2],
      funcs[3]
    );
  }

  _scope._resize = function() {
    this._resizeFunc = helpers.emptyFunction;

    this.widthHalf  = this._width  * .5;
    this.heightHalf = this._height * .5;

    this._setCanvasSize(this._width, this._height);
  }

  _scope._setCanvasSize = function(width, height) {
    this._canvas.width  = width;
    this._canvas.height = height;

    this._gl.viewport(0, 0, width, height);
  }

  _scope._destructRenderer = function() {
    this._destructContext();

    this.clearColor      =
    this._gl             =
    this._vertexShader   =
    this._fragmentShader =
    this._program        =
    this._locations      =
    this._config         =
    this._canvas         =
    this._context        = null;
  }

  _scope._destructContext = function() {
    this._gl.useProgram(null);
    this._gl.detachShader(this._program, this._vertexShader);
    this._gl.deleteShader(this._vertexShader);
    this._gl.detachShader(this._program, this._fragmentShader);
    this._gl.deleteShader(this._fragmentShader);
    this._gl.deleteProgram(this._program);

    this._loseContextExt && this._loseContextExt.loseContext();
  }

  _scope._createArrayBuffer = function(data, locationId, length, num, size, type, bytes) {
    var buffer = this._gl.createBuffer();

    this._gl.bindBuffer({{AGL.Const.ARRAY_BUFFER}}, buffer);
		this._gl.bufferData({{AGL.Const.ARRAY_BUFFER}}, data.byteLength, {{AGL.Const.DYNAMIC_DRAW}});

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
          type === {{AGL.Const.FLOAT}}
          ? ""
          : "I"
        ) + "Pointer"
      ](loc, size, type, false, stride, (num - i) * bytes * size);
			this._gl.vertexAttribDivisor(loc, 1);
		}
	}

  _scope._bindArrayBuffer = function(buffer, data) {
    this._gl.bindBuffer({{AGL.Const.ARRAY_BUFFER}}, buffer);
		this._gl.bufferSubData({{AGL.Const.ARRAY_BUFFER}}, 0, data);
  }

  _scope._init = function() {
    this._gl = this.context;

    this._loseContextExt = this._gl.getExtension('WEBGL_lose_context');

    this._gl.pixelStorei({{AGL.Const.UNPACK_PREMULTIPLY_ALPHA_WEBGL}}, true);
    this._gl.enable({{AGL.Const.BLEND}});

    this._vertexShader   = AGL.Utils.loadVertexShader(this._gl,   this._config.vertexShader(this._config));
    this._fragmentShader = AGL.Utils.loadFragmentShader(this._gl, this._config.fragmentShader(this._config));
    this._program        = AGL.Utils.createProgram(this._gl, [this._vertexShader, this._fragmentShader]);
    this._locations      = AGL.Utils.getLocationsFor(this._gl, this._program, this._config.locations);
    this._gl.useProgram(this._program);

    var positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer({{AGL.Const.ARRAY_BUFFER}}, positionBuffer);
    this._gl.bufferData(
      {{AGL.Const.ARRAY_BUFFER}},
      new F32A([
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ]),
      {{AGL.Const.STATIC_DRAW}}
    );
    this._gl.vertexAttribPointer(this._locations.aPos, 2, {{AGL.Const.FLOAT}}, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations.aPos);

    this._initCustom();
  }
};

AGL.RendererHelper.initConfig = function(config, target) {
  config = config || {};

  var attributes = config.contextAttributes || {};

  return {
    canvas    : config.canvas || AGL.Utils.createCanvas(config.isOffscreen),
    locations : (config.locations || []).concat([
      "aPos",
      "uTex"
    ]),
    vertexShader   : config.vertexShader   || target.createVertexShader,
    fragmentShader : config.fragmentShader || target.createFragmentShader,
    precision      : config.precision || "lowp", /* lowp mediump highp */

    contextAttributes : {
      alpha                 : attributes.alpha || false,
      antialias             : attributes.antialias || false,
      depth                 : attributes.depth || false,
      stencil               : attributes.stencil || false,
      premultipliedAlpha    : attributes.premultipliedAlpha || false,
      powerPreference       : attributes.powerPreference || "high-performance",
      preserveDrawingBuffer : attributes.preserveDrawingBuffer || true,
    }
  };
}

AGL.RendererHelper.pointsOrder = new Uint16Array([
  0, 1, 2,
  0, 2, 3
]);

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
