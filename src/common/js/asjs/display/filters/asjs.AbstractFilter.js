ASJS.AbstractFilter = createClass(
"AbstractFilter",
ASJS.BaseClass,
function(_scope) {
  _scope.new = function(value) {
    _scope.value = value;
  }
  
  _scope.execute = function() {}
});
