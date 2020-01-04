createClass(ASJS, "Matrix", ASJS.BaseClass, function(_scope) {
  _scope.new = function(a, b, c, d, e, f) {
    _scope.a = tis(a, "number") ? a : 1;
    _scope.b = tis(b, "number") ? b : 0;
    _scope.c = tis(c, "number") ? c : 0;
    _scope.d = tis(d, "number") ? d : 1;
    _scope.e = tis(e, "number") ? e : 0;
    _scope.f = tis(f, "number") ? f : 0;
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
