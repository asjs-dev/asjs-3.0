require("../../helpers/createClass.js");
require("../../helpers/BaseClass.js");
require("../../helpers/typeIs.js");
require("../../helpers/inArray.js");

require("../NameSpace.js");

helpers.createClass(ASJSUtils, "Iterator", helpers.BaseClass, function(_scope) {
  var _steps = [];
  var _response;
  var _step = -1;

  _scope.new = function(steps) {
    if (!steps || steps.length === 0) return;
    var i = -1;
    var l = steps.length;
    while (++i < l) _scope.add(steps[i]);
  }

  _scope.add = function(fv) {
    fv && helpers.typeIs(fv, "function") && !helpers.inArray(_steps, fv) && _steps.push(fv);
    return _scope;
  }

  _scope.next = function(value) {
    _response = _steps[++_step](_response || value);
    if (_step >= _steps.length - 1) _step = -1;
    return _response;
  }
});
