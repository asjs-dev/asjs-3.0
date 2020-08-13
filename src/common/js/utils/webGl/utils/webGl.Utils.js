require("../NameSpace.js");

createSingletonClass(WebGl, "Utils", ASJS.BaseClass, function(_scope) {
  _scope.webGlInfo = {};

  _scope.new = parseWebglInfo;

  function parseWebglInfo() {
    _scope.webGlInfo.isWebGl2Supported = false;
    map(["webgl2"], function(id, item) {
      var canvas = document.createElement("canvas");
      var gl;
      if (gl = canvas.getContext(item)) {
        _scope.webGlInfo.isWebGl2Supported            = true;
        _scope.webGlInfo.maxTextureImageUnits         = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        _scope.webGlInfo.maxTextureSize               = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        _scope.webGlInfo.maxVertexAttributes          = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        _scope.webGlInfo.maxVaryingVectors            = gl.getParameter(gl.MAX_VARYING_VECTORS);
        _scope.webGlInfo.maxVertexUniformVectors      = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        _scope.webGlInfo.maxFragmentUniformComponents = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_COMPONENTS);
        _scope.webGlInfo.maxFragmentUniformVectors    = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        _scope.webGlInfo.maxVaryingComponents         = gl.getParameter(gl.MAX_VARYING_COMPONENTS);
      }
    });
  }

  _scope.useTexture = function(gl, index, textureInfo) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(textureInfo.target, textureInfo.texture);
    
    gl.texImage2D(
      textureInfo.target,
      0,
      gl.RGBA,
      textureInfo.width,
      textureInfo.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textureInfo.source
    );
    gl.texParameteri(textureInfo.target, gl.TEXTURE_MAX_LEVEL, textureInfo.maxLevel);

    var generateMipmap = isPowerOf2(textureInfo.width) && isPowerOf2(textureInfo.height);

    if (generateMipmap) {
      gl.generateMipmap(textureInfo.target);
      gl.flush();
    }

    gl.texParameteri(textureInfo.target, gl.TEXTURE_WRAP_S, textureInfo.wrapS);
    gl.texParameteri(textureInfo.target, gl.TEXTURE_WRAP_T, textureInfo.wrapT);

    /*if (generateMipmap) {
      gl.texParameteri(
        textureInfo.target,
        gl.TEXTURE_MIN_FILTER,
        textureInfo.minFilter === gl.LINEAR
          ? gl.LINEAR_MIPMAP_LINEAR
          : gl.NEAREST_MIPMAP_NEAREST
      );
    } else {
      gl.texParameteri(textureInfo.target, gl.TEXTURE_MIN_FILTER, textureInfo.minFilter);
    }*/

    gl.texParameteri(textureInfo.target, gl.TEXTURE_MIN_FILTER, textureInfo.minFilter);
    gl.texParameteri(textureInfo.target, gl.TEXTURE_MAG_FILTER, textureInfo.magFilter);
  }

  _scope.loadShader = function(gl, shaderType, shaderSource) {
    var shader = gl.createShader(gl[shaderType]);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var lastError = gl.getShaderInfoLog(shader);
      trace("Error compiling shader " + shaderType + ":" + lastError);
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

    gl.flush();

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

  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }
});
WebGl.Utils.ShaderType = {
  "VERTEX_SHADER"   : "VERTEX_SHADER",
  "FRAGMENT_SHADER" : "FRAGMENT_SHADER"
};
