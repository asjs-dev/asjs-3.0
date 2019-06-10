createClass(ASJS, "Matrix", ASJS.BaseClass, function(_scope) {
  _scope.new = function(a, b, c, d, e, f) {
    _scope.a = !tis(a, "number") ? 1 : a;
    _scope.b = !tis(b, "number") ? 0 : b;
    _scope.c = !tis(c, "number") ? 0 : c;
    _scope.d = !tis(d, "number") ? 1 : d;
    _scope.e = !tis(e, "number") ? 0 : e;
    _scope.f = !tis(f, "number") ? 0 : f;
  }

  _scope.translate = function(tx, ty) {
    _scope.e = tx;
    _scope.f = ty;
  }

  _scope.skew = function(sx, sy) {
    _scope.b = sx;
    _scope.c = sy;
  }

  _scope.scale = function(sw, sh) {
    _scope.a = sw;
    _scope.d = sh;
  }
});
