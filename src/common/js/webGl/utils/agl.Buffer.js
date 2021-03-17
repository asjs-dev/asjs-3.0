require("../NameSpace.js");

AGL.Buffer = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Buffer(data, locationName, length, num, size, target, type, divisor) {
    helpers.BasePrototypeClass.call(this);

    /*
    this._buffer = null;
    */

    this.data          = data;
    this._locationName = locationName;
    this._length       = length * 4;
    this._num          = num;
    this._size         = size;
    this._byteSize     = size * 4;
    this._target       = target || {{AGL.Const.ARRAY_BUFFER}};
    this._type         = type   || {{AGL.Const.DYNAMIC_DRAW}};
    this._divisor      = helpers.isEmpty(divisor) ? 1 : 0;
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
      while (++i < this._num) {
        var loc = location + i;
        gl.vertexAttribPointer(loc, this._size, {{AGL.Const.FLOAT}}, false, this._length, i * this._byteSize);
        gl.vertexAttribDivisor(loc, this._divisor);
        gl.enableVertexAttribArray(loc);
      }
    }
  }
);
