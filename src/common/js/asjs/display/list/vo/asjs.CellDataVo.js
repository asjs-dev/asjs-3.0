createClass(ASJS, "CellDataVo", BaseClass, function(_scope) {
  _scope.new = function(data) {
    var d = data || {};

    _scope.id = d.id;
  }
});
