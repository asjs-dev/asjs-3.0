require("../NameSpace.js");

AGL.Const = {};

var Utils = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Utils() {
    helpers.BasePrototypeClass.call(this);

    this.loadVertexShader   = this.loadShader.bind(this, "VERTEX_SHADER");
    this.loadFragmentShader = this.loadShader.bind(this, "FRAGMENT_SHADER");

    this.info = {
      isWebGl2Supported : false
    };

    var canvas = document.createElement("canvas");
    var gl;
    if (gl = canvas.getContext("webgl2")) {
      for (var key in gl) key === key.toUpperCase() && helpers.typeIs(gl[key], "number") && (AGL.Const[key] = gl[key]);

      this.info.isWebGl2Supported    = true;
      this.info.maxTextureImageUnits = gl.getParameter({{AGL.Const.MAX_TEXTURE_IMAGE_UNITS}});
    }
    gl     =
    canvas = null;

    window.addEventListener("beforeunload", this.onBeforeUnload.bind(this));
  },
  function(_scope) {
    _scope.useTexture = function(gl, index, textureInfo) {
      this.bindTexture(gl, index, textureInfo);

      gl.texImage2D(
        textureInfo.target,
        0,
        textureInfo.internalFormat,
        textureInfo.width,
        textureInfo.height,
        0,
        textureInfo.format,
        {{AGL.Const.UNSIGNED_BYTE}},
        textureInfo.source
      );

      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_MAX_LEVEL}}, textureInfo.maxLevel);

      textureInfo.generateMipmap && gl.generateMipmap(textureInfo.target);
    }

    _scope.bindTexture = function(gl, index, textureInfo) {
      gl.activeTexture({{AGL.Const.TEXTURE0}} + index);
      gl.bindTexture(textureInfo.target, textureInfo.baseTexture);

      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_WRAP_S}},     textureInfo.wrapS);
      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_WRAP_T}},     textureInfo.wrapT);
      gl.texParameteri(textureInfo.target, {{AGL.Const.TEXTURE_MIN_FILTER}}, textureInfo.mipmapMinFilter);
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
);

AGL.Const = {};
AGL.Utils = new Utils();
