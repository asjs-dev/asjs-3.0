require("../NameSpace.js");

(function() {
  var Utils = helpers.createPrototypeClass(
    helpers.BasePrototypeClass,
    function Utils() {
      helpers.BasePrototypeClass.call(this);

      this.loadVertexShader = this.loadShader.bind(this, "VERTEX_SHADER");
      this.loadFragmentShader = this.loadShader.bind(this, "FRAGMENT_SHADER");

      this.info = {
        "isWebGl2Supported": false
      };

      AGL.Consts = {};

      var canvas = document.createElement("canvas");
      var gl;
      if (gl = canvas.getContext("webgl2")) {
        for (var key in gl) {
            if (typeof gl[key] === "number") AGL.Consts[key] = gl[key];
        }

        this.info.isWebGl2Supported            = true;
        this.info.maxTextureImageUnits         = gl.getParameter(AGL.Consts.MAX_TEXTURE_IMAGE_UNITS);
        //this.info.maxTextureSize               = gl.getParameter(AGL.Consts.MAX_TEXTURE_SIZE);
        //this.info.maxVertexAttributes          = gl.getParameter(AGL.Consts.MAX_VERTEX_ATTRIBS);
        //this.info.maxVaryingVectors            = gl.getParameter(AGL.Consts.MAX_VARYING_VECTORS);
        //this.info.maxVertexUniformVectors      = gl.getParameter(AGL.Consts.MAX_VERTEX_UNIFORM_VECTORS);
        //this.info.maxFragmentUniformComponents = gl.getParameter(AGL.Consts.MAX_FRAGMENT_UNIFORM_COMPONENTS);
        //this.info.maxFragmentUniformVectors    = gl.getParameter(AGL.Consts.MAX_FRAGMENT_UNIFORM_VECTORS);
        //this.info.maxVaryingComponents         = gl.getParameter(AGL.Consts.MAX_VARYING_COMPONENTS);
      }
      canvas = null;
    },
    function(_scope) {
      _scope.useTexture = function(gl, index, textureInfo) {
        gl.activeTexture(AGL.Consts.TEXTURE0 + index);
        gl.bindTexture(textureInfo.target, textureInfo.getTexture(gl));

        gl.texImage2D(
          textureInfo.target,
          0,
          AGL.Consts.RGBA,
          textureInfo.width,
          textureInfo.height,
          0,
          AGL.Consts.RGBA,
          AGL.Consts.UNSIGNED_BYTE,
          textureInfo.source
        );
        gl.texParameteri(textureInfo.target, AGL.Consts.TEXTURE_MAX_LEVEL, textureInfo.maxLevel);

        if (textureInfo.generateMipmap) {
          gl.generateMipmap(textureInfo.target);
          gl.flush();
        }

        gl.texParameteri(textureInfo.target, AGL.Consts.TEXTURE_WRAP_S, textureInfo.wrapS);
        gl.texParameteri(textureInfo.target, AGL.Consts.TEXTURE_WRAP_T, textureInfo.wrapT);

        if (textureInfo.generateMipmap) {
          gl.texParameteri(
            textureInfo.target,
            AGL.Consts.TEXTURE_MIN_FILTER,
            textureInfo.minFilter === AGL.Consts.LINEAR
              ? AGL.Consts.LINEAR_MIPMAP_LINEAR
              : AGL.Consts.NEAREST_MIPMAP_NEAREST
          );
        } else {
          gl.texParameteri(textureInfo.target, AGL.Consts.TEXTURE_MIN_FILTER, textureInfo.minFilter);
        }

        gl.texParameteri(textureInfo.target, AGL.Consts.TEXTURE_MIN_FILTER, textureInfo.minFilter);
        gl.texParameteri(textureInfo.target, AGL.Consts.TEXTURE_MAG_FILTER, textureInfo.magFilter);
      }

      _scope.loadShader = function(shaderType, gl, shaderSource) {
        var shader = gl.createShader(gl[shaderType]);

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        var compiled = gl.getShaderParameter(shader, AGL.Consts.COMPILE_STATUS);
        if (!compiled) {
          var lastError = gl.getShaderInfoLog(shader);
          console.log("Error compiling shader " + shaderType + ": " + lastError);
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      }

      _scope.createProgram = function(gl, shaders, opt_attribs, opt_locations) {
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

        var linked = gl.getProgramParameter(program, AGL.Consts.LINK_STATUS);
        if (!linked) {
            var lastError = gl.getProgramInfoLog(program);
            console.log("Error in program linking: " + lastError);
            gl.deleteProgram(program);
            return null;
        }

        gl.flush();

        return program;
      }

      _scope.getLocationsFor = function(gl, program, locationsDescriptor) {
        var locations = {};
        helpers.map(locationsDescriptor, function(key, shaderLocationType) {
          locations[key] = gl[shaderLocationType](program, key);
        });
        return locations;
      }

      _scope.unbindTexture = function(gl, texture) {
        gl.bindTexture(texture.target, null);
      }

      _scope.destroyTexture = function(gl, texture) {
        this.unbindTexture(gl, texture);
        gl.deleteTexture(texture.getTexture(gl));
      }

      _scope.isPowerOf2 = function(value) {
        return (value & (value - 1)) == 0;
      }
    }
  );

  AGL.Consts = {};
  AGL.Utils = new Utils();

  Object.freeze(AGL.Consts);
  Object.freeze(AGL.Utils);
})();
