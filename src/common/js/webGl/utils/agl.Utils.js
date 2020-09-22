require("../NameSpace.js");

(function() {
  var Utils = helpers.createPrototypeClass(
    helpers.BasePrototypeClass,
    function Utils() {
      helpers.BasePrototypeClass.call(this);

      this.info = {
        "isWebGl2Supported": false
      };

      var canvas = document.createElement("canvas");
      var gl;
      if (gl = canvas.getContext("webgl2")) {
        this.info.isWebGl2Supported            = true;
        this.info.maxTextureImageUnits         = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this.info.maxTextureSize               = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.info.maxVertexAttributes          = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this.info.maxVaryingVectors            = gl.getParameter(gl.MAX_VARYING_VECTORS);
        this.info.maxVertexUniformVectors      = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this.info.maxFragmentUniformComponents = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_COMPONENTS);
        this.info.maxFragmentUniformVectors    = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        this.info.maxVaryingComponents         = gl.getParameter(gl.MAX_VARYING_COMPONENTS);
      }
    },
    function() {
      this.useTexture = function(gl, index, textureInfo) {
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

        if (textureInfo.generateMipmap) {
          gl.generateMipmap(textureInfo.target);
          gl.flush();
        }

        gl.texParameteri(textureInfo.target, gl.TEXTURE_WRAP_S, textureInfo.wrapS);
        gl.texParameteri(textureInfo.target, gl.TEXTURE_WRAP_T, textureInfo.wrapT);

        if (textureInfo.generateMipmap) {
          gl.texParameteri(
            textureInfo.target,
            gl.TEXTURE_MIN_FILTER,
            textureInfo.minFilter === gl.LINEAR
              ? gl.LINEAR_MIPMAP_LINEAR
              : gl.NEAREST_MIPMAP_NEAREST
          );
        } else {
          gl.texParameteri(textureInfo.target, gl.TEXTURE_MIN_FILTER, textureInfo.minFilter);
        }

        gl.texParameteri(textureInfo.target, gl.TEXTURE_MIN_FILTER, textureInfo.minFilter);
        gl.texParameteri(textureInfo.target, gl.TEXTURE_MAG_FILTER, textureInfo.magFilter);
      }

      this.loadShader = function(shaderType, gl, shaderSource) {
        var shader = gl.createShader(gl[shaderType]);

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
          var lastError = gl.getShaderInfoLog(shader);
          console.log("Error compiling shader " + shaderType + ": " + lastError);
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      }

      this.loadVertexShader = this.loadShader.bind(this, "VERTEX_SHADER");
      this.loadFragmentShader = this.loadShader.bind(this, "FRAGMENT_SHADER");

      this.createProgram = function(gl, shaders, opt_attribs, opt_locations) {
        var program = gl.createProgram();

        helpers.map(shaders, function(key, shader) {
          gl.attachShader(program, shader);
        });

        if (opt_attribs) {
          helpers.map(opt_attribs, function(key, attrib) {
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
            console.log("Error in program linking: " + lastError);
            gl.deleteProgram(program);
            return null;
        }

        gl.flush();

        return program;
      }

      this.getLocationsFor = function(gl, program, locationsDescriptor) {
        var locations = {};
        helpers.map(locationsDescriptor, function(key, shaderLocationType) {
          locations[key] = gl[shaderLocationType](program, key);
        });
        return locations;
      }

      this.unbindTexture = function(gl, texture) {
        gl.bindTexture(texture.target, null);
      }

      this.destroyTexture = function(gl, texture) {
        gl.bindTexture(texture.target, null);
        gl.deleteTexture(texture.texture);
      }

      this.isPowerOf2 = function(value) {
        return (value & (value - 1)) == 0;
      }
    }
  );
  AGL.Utils = new Utils();

  Object.freeze(AGL.Utils);
})();
