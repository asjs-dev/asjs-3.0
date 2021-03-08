require("../NameSpace.js");

AGL.Utils = new (helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Utils() {
    helpers.BasePrototypeClass.call(this);

    this.loadVertexShader   = this.loadShader.bind(this, "VERTEX_SHADER");
    this.loadFragmentShader = this.loadShader.bind(this, "FRAGMENT_SHADER");

    this.info = {
      isWebGl2Supported : false
    };

    window.addEventListener("beforeunload", this.onBeforeUnload.bind(this));
  },
  function(_scope) {
    _scope.initConfig = function(config, target) {
      config = config || {};

      var attributes = config.contextAttributes || {};

      return {
        canvas    : config.canvas || AGL.Utils.createCanvas(config.isOffscreen),
        locations : (config.locations || []).concat([
          "uFlpY",
          "aPos",
          "uTex"
        ]),
        vertexShader   : config.vertexShader   || target.createVertexShader,
        fragmentShader : config.fragmentShader || target.createFragmentShader,
        precision      : config.precision      || "lowp", /* lowp mediump highp */

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

    _scope.pointsOrder = new Uint16Array([
      0, 1, 2,
      0, 2, 3
    ]);

    _scope.createVersion = function(precision) {
      return "#version 300 es\nprecision " + precision + " float;\n";
    }

    _scope.createGetTextureFunction = function(maxTextureImageUnits) {
      var func =
      "vec4 gtTexCol(float i,vec2 c){";

      for (var i = 0; i < maxTextureImageUnits; ++i) func +=
        (i > 0 ? "else " : "") + "if(i<" + (i + 1) + ".)return texture(uTex[" + i + "],c);";

      func +=
        "return vec4(0);" +
      "}";
      return func;
    };

    _scope.getTexColor = "fgCol=gtTexCol(vTexId,vTexCrop.xy+vTexCrop.zw*mod(vTCrd,1.));";

    _scope.calcGlPositions =
      "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
      "mat3 tMt=mat3(aMt[1].zw,0,aMt[2].xy,0,aMt[2].zw,1);" +
      "vec3 pos=vec3(aPos,1);" +
      "gl_Position=vec4(mt*pos,1);" +
      "gl_Position.y*=uFlpY;" +
      "vTCrd=(tMt*pos).xy;" +
      "vTexCrop=aMt[3];";

    _scope.createCanvas = function(isOffscreenCanvas) {
      return isOffscreenCanvas && window.OffscreenCanvas
        ? new window.OffscreenCanvas(1, 1)
        : document.createElement("canvas");
    }

    _scope.initApplication = function(callback) {
      function checkCanvas(inited) {
        if (document.readyState === "complete") {
          document.addEventListener("readystatechange", checkCanvasBound);

          var gl = this.createCanvas(true).getContext("webgl2");
          if (gl) {
            this.info.isWebGl2Supported    = true;
            this.info.maxTextureImageUnits = gl.getParameter({{AGL.Const.MAX_TEXTURE_IMAGE_UNITS}});
          }
          gl = null;

          callback(this.info.isWebGl2Supported);
        } else if (!inited) document.addEventListener("readystatechange", checkCanvasBound);
      }

      var checkCanvasBound = checkCanvas.bind(this, true);
      checkCanvas();
    }

    _scope.useActiveTexture = function(gl, textureInfo, index) {
      gl.activeTexture({{AGL.Const.TEXTURE0}} + index);
      this.useTexture(gl, textureInfo);
    }

    _scope.bindActiveTexture = function(gl, textureInfo, index) {
      gl.activeTexture({{AGL.Const.TEXTURE0}} + index);
      this.bindTexture(gl, textureInfo);
    }

    _scope.bindFrameBuffer = function(gl, textureInfo) {
      gl.bindFramebuffer({{AGL.Const.FRAMEBUFFER}}, textureInfo.framebuffer);
    }

    _scope.unbindFrameBuffer = function(gl) {
      gl.bindFramebuffer({{AGL.Const.FRAMEBUFFER}}, null);
    }

    _scope.useTexture = function(gl, textureInfo) {
      this.bindTexture(gl, textureInfo);
      this.uploadTexture(gl, textureInfo);
    }

    _scope.uploadTexture = function(gl, textureInfo) {
      gl.texImage2D(
        textureInfo.target,
        0,
        textureInfo.internalFormat,
        textureInfo.width,
        textureInfo.height,
        0,
        textureInfo.format,
        {{AGL.Const.UNSIGNED_BYTE}},
        textureInfo.renderSource
      );

      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_MAX_LEVEL}}, 0);
      gl.generateMipmap(textureInfo.target);
    }

    _scope.bindTexture = function(gl, textureInfo) {
      gl.bindTexture(textureInfo.target, textureInfo.baseTexture);

      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_WRAP_S}},     textureInfo.wrapS);
      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_WRAP_T}},     textureInfo.wrapT);
      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_MIN_FILTER}}, textureInfo.minMipmapFilter);
      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_MAG_FILTER}}, textureInfo.magFilter);
    }

    _scope.loadShader = function(shaderType, gl, shaderSource) {
      var shader = gl.createShader(gl[shaderType]);

      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);

      var compiled = gl.getShaderParameter(shader, {{AGL.Const.COMPILE_STATUS}});
      if (!compiled) {
        var lastError = gl.getShaderInfoLog(shader);
        console.log("Error compiling shader " + shaderType + ": " + lastError);
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    _scope.createProgram = function(gl, shaders, attribs, locations) {
      var program = gl.createProgram();

      helpers.map(shaders, function(key, shader) {
        gl.attachShader(program, shader);
      });

      if (attribs) {
        helpers.map(attribs, function(key, attrib) {
          gl.bindAttribLocation(
            program,
            locations ? locations[key] : key,
            attrib
          );
        });
      }
      gl.linkProgram(program);

      var linked = gl.getProgramParameter(program, {{AGL.Const.LINK_STATUS}});
      if (!linked) {
          var lastError = gl.getProgramInfoLog(program);
          console.log("Error in program linking: " + lastError);
          gl.deleteProgram(program);
          return null;
      }

      return program;
    }

    _scope.getLocationsFor = function(gl, program, locationsDescriptor) {
      var locationTypes = {
        a : "Attrib",
        u : "Uniform"
      }
      var locations = {};
      helpers.map(locationsDescriptor, function(key, name) {
        locations[name] = gl["get" + locationTypes[name[0]] + "Location"](program, name);
      });
      return locations;
    }

    _scope.destroyTexture = function(gl, textureInfo) {
      if (gl && textureInfo && textureInfo.baseTexture) {
        gl.bindTexture(textureInfo.target, null);
        gl.deleteTexture(textureInfo.baseTexture);
      }
    }

    _scope.destroyFramebuffer = function(gl, framebuffer) {
      if (gl && framebuffer) {
        gl.bindFramebuffer({{AGL.Const.FRAMEBUFFER}}, null);
        gl.deleteFramebuffer(framebuffer);
      }
    }

    _scope.isPowerOf2 = function(value) {
      return (value & (value - 1)) == 0;
    }

    _scope.onBeforeUnload = function() {
      this.loadVertexShader   =
      this.loadFragmentShader =
      this.info               = null;

      this.destruct();
    }
  }
))();
