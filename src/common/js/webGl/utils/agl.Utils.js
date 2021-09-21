require("../NameSpace.js");

AGL.Utils = new (helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Utils() {
    helpers.BasePrototypeClass.call(this);

    this.THETA = Math.PI / 180;

    this.loadVertexShader   = this.loadShader.bind(this, {{AGL.Const.VERTEX_SHADER}});
    this.loadFragmentShader = this.loadShader.bind(this, {{AGL.Const.FRAGMENT_SHADER}});

    this.info = {
      isWebGl2Supported : false
    };
  },
  function(_scope) {
    _scope.initContextConfig = function(config) {
      config = config || {};

      return {
        canvas            : config.canvas || document.createElement("canvas"),
        contextAttributes : Object.assign({
          powerPreference       : "high-performance",
          preserveDrawingBuffer : true,
        }, config.contextAttributes || {});
      };
    }

    _scope.initRendererConfig = function(config) {
      config = config || {};
      return {
        locations : config.locations || [],
        precision : config.precision || "lowp", /* lowp mediump highp */
        context   : config.context   || new AGL.Context()
      };
    }

    _scope.createVersion = function(precision) {
      return "#version 300 es\nprecision " + precision + " float;\n";
    }

    _scope.initApplication = function(callback) {
      function checkCanvas(inited) {
        if (document.readyState === "complete") {
          document.addEventListener("readystatechange", checkCanvasBound);

          var gl = document.createElement("canvas").getContext("webgl2");
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

    _scope.loadShader = function(shaderType, gl, shaderSource) {
      var shader = gl.createShader(shaderType);

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

    _scope.GLSL_RANDOM = "float rand(vec2 p,float s){" +
      "p+=floor(p/10000.);" +
      "p=mod(p,vec2(10000));" +
      "return fract(sin(dot(p,vec2(sin(p.x+p.y),cos(p.y-p.x)))*s)*.5+.5);" +
    "}";
  }
))();
