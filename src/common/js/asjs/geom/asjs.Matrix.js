createClass(ASJS, "Matrix", ASJS.BaseClass, function(_scope) {
  _scope.new = function(a, b, c, d, e, f) {
    _scope.a = tis(a, "number") ? a : 1;
    _scope.b = tis(b, "number") ? b : 0;
    _scope.c = tis(c, "number") ? c : 0;
    _scope.d = tis(d, "number") ? d : 1;
    _scope.e = tis(e, "number") ? e : 0;
    _scope.f = tis(f, "number") ? f : 0;
  }
});

rof(ASJS.Matrix, "translate", function(m, tx, ty) {
  m.e = tx;
  m.f = ty;
});

rof(ASJS.Matrix, "skew", function(m, sx, sy) {
  m.b = sx;
  m.c = sy;
});

rof(ASJS.Matrix, "scale", function(m, sw, sh) {
  m.a = sw;
  m.d = sh;
});
