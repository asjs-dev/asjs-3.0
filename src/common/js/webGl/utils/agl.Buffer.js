require("../NameSpace.js");

AGL.Buffer = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Buffer(data, locationName, rows, cols, target, type, divisor) {
    helpers.BasePrototypeClass.call(this);

    /*
    this._buffer = null;
    */

    var length = rows * cols;

    this.data          = typeof data === "number" ? new F32A(data * length) : data;
    this._locationName = locationName;
    this._rows         = rows;
    this._cols         = cols;
    this._length       = length * 4;
    this._byteSize     = cols * 4;
    this._target       = target || {{AGL.Const.ARRAY_BUFFER}};
    this._type         = type   || {{AGL.Const.DYNAMIC_DRAW}};
    this._divisor      = typeof divisor === "number" ? divisor : 1;
  },
  function(_scope) {
    _scope.create = function(gl) {
      this._buffer = gl.createBuffer();
      this.bind(gl);
    }

    _scope.bind = function(gl) {
      gl.bindBuffer(this._target, this._buffer);
    }

    _scope.upload = function(gl, enabled, locations) {
      this.bind(gl);
  		gl.bufferData(this._target, this.data, this._type);
      enabled && this._enable(gl, locations);
    }

    _scope.enable = function(gl, locations) {
      this.bind(gl);
      this._enable(gl, locations);
    }

    _scope._enable = function(gl, locations) {
      var location = locations[this._locationName];
      var i = -1;
      while (++i < this._rows) {
        var loc = location + i;
        gl.vertexAttribPointer(loc, this._cols, {{AGL.Const.FLOAT}}, false, this._length, i * this._byteSize);
        gl.vertexAttribDivisor(loc, this._divisor);
        gl.enableVertexAttribArray(loc);
      }
    }
  }
);
