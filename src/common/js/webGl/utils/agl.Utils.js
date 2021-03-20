require("../NameSpace.js");

AGL.Utils = new (helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Utils() {
    helpers.BasePrototypeClass.call(this);

    this.loadVertexShader   = this.loadShader.bind(this, {{AGL.Const.VERTEX_SHADER}});
    this.loadFragmentShader = this.loadShader.bind(this, {{AGL.Const.FRAGMENT_SHADER}});

    this.info = {
      isWebGl2Supported : false
    };

    window.addEventListener("beforeunload", this.onBeforeUnload.bind(this));
  },
  function(_scope) {
    _scope.initContextConfig = function(config) {
      config = config || {};

      var attributes = config.contextAttributes || {};

      return {
        canvas            : config.canvas || document.createElement("canvas"),
        contextAttributes : {
          alpha                 : attributes.alpha                 || false,
          antialias             : attributes.antialias             || false,
          depth                 : attributes.depth                 || false,
          stencil               : attributes.stencil               || false,
          premultipliedAlpha    : attributes.premultipliedAlpha    || false,
          powerPreference       : attributes.powerPreference       || "high-performance",
          preserveDrawingBuffer : attributes.preserveDrawingBuffer || true,
        }
      };
    }

    _scope.initRendererConfig = function(config, target) {
      config = config || {};
      return {
        locations : (config.locations || []).concat([
          "aMt",
          "uFlpY",
          "aPos",
          "uTex"
        ]),
        precision : config.precision || "lowp", /* lowp mediump highp */
        context   : config.context   || new AGL.Context()
      };
    }

    _scope.createVersion = function(precision) {
      return "#version 300 es\nprecision " + precision + " float;\n";
    }

    _scope.createGetTextureFunction = function(maxTextureImageUnits) {
      var func =
      "vec4 gtTexCol(float i,vec2 c){" +
        "if(i<0.)return vec4(1);";

      for (var i = 0; i < maxTextureImageUnits; ++i) func +=
        "else if(i<" + (i + 1) + ".)return texture(uTex[" + i + "],c);";

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
