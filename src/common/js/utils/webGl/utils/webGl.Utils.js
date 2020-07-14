require("../NameSpace.js");

createSingletonClass(WebGl, "Utils", ASJS.BaseClass, function(_scope) {
  var _webGlInfo = {};

  _scope.new = function() {
    parseWebglInfo();
  }

  get(_scope, "webGlInfo", function() { return _webGlInfo; });

  function parseWebglInfo() {
    _webGlInfo.maxTextureImageUnits = 0;
    map(["webgl2"], function(id, item) {
      var canvas = document.createElement("canvas");
      var context;
      if (context = canvas.getContext(item)) {
        _webGlInfo.maxTextureImageUnits = context.getParameter(context.MAX_TEXTURE_IMAGE_UNITS);
        _webGlInfo.maxTextureSize       = context.getParameter(context.MAX_TEXTURE_SIZE);
      }
    });
  }

  _scope.bindTexture2DSource = function(gl, textureInfo) {
    gl.activeTexture(gl.TEXTURE0 + _webGlInfo.maxTextureImageUnits + 1);
    gl.bindTexture(textureInfo.target, textureInfo.texture);
    gl.texImage2D(textureInfo.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureInfo.source);
    gl.texParameteri(textureInfo.target, gl.TEXTURE_WRAP_S, textureInfo.wrapS);
    gl.texParameteri(textureInfo.target, gl.TEXTURE_WRAP_T, textureInfo.wrapT);
    gl.texParameteri(textureInfo.target, gl.TEXTURE_MIN_FILTER, textureInfo.minFilter);
    gl.texParameteri(textureInfo.target, gl.TEXTURE_MAG_FILTER, textureInfo.magFilter);
    gl.generateMipmap(textureInfo.target);
  }

  _scope.loadShader = function(gl, shaderType, shaderSource) {
    var shader = gl.createShader(gl[shaderType]);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var lastError = gl.getShaderInfoLog(shader);
      trace("Error compiling shader '" + shader + "':" + lastError);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  _scope.createProgram = function(gl, shaders, opt_attribs, opt_locations) {
    var program = gl.createProgram();

    map(shaders, function(key, shader) {
      gl.attachShader(program, shader);
    });

    if (opt_attribs) {
      map(opt_attribs, function(key, attrib) {
        gl.bindAttribLocation(
          program,
          opt_locations ? opt_locations[key] : key,
          attrib
        );
      });
    }
    gl.linkProgram(program);

    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var lastError = gl.getProgramInfoLog(program);
        trace("Error in program linking:" + lastError);
        gl.deleteProgram(program);
        return null;
    }

    return program;
  }

  _scope.getLocationsFor = function(gl, program, locationsDescriptor) {
    var locations = {};
    map(locationsDescriptor, function(key, shaderLocationType) {
      locations[key] = gl[shaderLocationType](program, key);
    });
    return locations;
  }

  _scope.destroyTexture = function(gl, texture) {
    gl.bindTexture(texture.target, null);
    gl.deleteTexture(texture.texture);
  }
});
cnst(WebGl.Utils, "ShaderType", {
  "VERTEX_SHADER"   : "VERTEX_SHADER",
  "FRAGMENT_SHADER" : "FRAGMENT_SHADER"
});
