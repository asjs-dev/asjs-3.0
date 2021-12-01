import "../NameSpace.js";

(function() {
  AGL.Utils = {};

  AGL.Utils.THETA = Math.PI / 180;

  AGL.Utils.GLSL_RANDOM = "float rand(vec2 p,float s){" +
    "p=mod(" +
      "p+floor(p/10000.)," +
      "vec2(10000)" +
    ");" +
    "return fract(" +
      "sin(" +
        "dot(" +
          "p," +
          "vec2(" +
            "sin(p.x+p.y)," +
            "cos(p.y-p.x)" +
          ")" +
        ")*s" +
      ")*.5+.5" +
    ");" +
  "}";

  AGL.Utils.INFO = {
    isWebGl2Supported : false
  };

  AGL.Utils.initContextConfig = (config) => {
    config = config || {};

    return {
      canvas            : config.canvas || document.createElement("canvas"),
      contextAttributes : {... {
        powerPreference       : "high-performance",
        preserveDrawingBuffer : true,
      }, ... (config.contextAttributes || {})};
    };
  };

  AGL.Utils.initRendererConfig = (config) => {
    config = config || {};

    return {
      locations : config.locations || [],
      precision : config.precision || "lowp", /* lowp mediump highp */
      context   : config.context   || new AGL.Context()
    };
  };

  AGL.Utils.createVersion = (precision) => "#version 300 es\n" +
    "precision " + precision + " float;\n";

  AGL.Utils.initApplication = (callback) => {
    const checkCanvas = (inited) => {
      if (document.readyState === "complete") {
        document.removeEventListener("readystatechange", checkCanvasBound);

        const gl = document.createElement("canvas").getContext("webgl2");
        if (gl) {
          AGL.Utils.INFO.isWebGl2Supported    = true;
          AGL.Utils.INFO.maxTextureImageUnits = gl.getParameter(AGL.Const.MAX_TEXTURE_IMAGE_UNITS);
        }

        callback(AGL.Utils.INFO.isWebGl2Supported);
      } else if (!inited)
        document.addEventListener("readystatechange", checkCanvasBound);
    };

    const checkCanvasBound = checkCanvas.bind(this, true);
    checkCanvas();
  }

  const _createShader = (gl, shaderType, shaderSource) => {
    const shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    return shader;
  }

  AGL.Utils.createProgram = (gl, vertexShaderSource, fragmentShaderSource) => {
    const vertexShader   = _createShader(gl, AGL.Const.VERTEX_SHADER,   vertexShaderSource);
    const fragmentShader = _createShader(gl, AGL.Const.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, AGL.Const.LINK_STATUS)) {
      console.error(
        "Program info:",         gl.getProgramInfoLog(program), "\n",
        "Validate status:",      gl.getProgramParameter(program, AGL.Const.VALIDATE_STATUS), "\n",
        "Vertex shader info:",   gl.getShaderInfoLog(vertexShader), "\n",
        "Fragment shader info:", gl.getShaderInfoLog(fragmentShader)
      );

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);

      throw "WebGL application stoped";
    };

    return program;
  }

  const _locationTypes = {
    a : "Attrib",
    u : "Uniform"
  };

  AGL.Utils.getLocationsFor = (gl, program, locationsDescriptor) => {
    const locations = {};

    locationsDescriptor.forEach(function(name) {
      locations[name] = gl["get" + _locationTypes[name[0]] + "Location"](program, name);
    });

    return locations;
  }
})();
