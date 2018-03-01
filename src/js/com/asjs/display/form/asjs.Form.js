ASJS.import("com/asjs/display/asjs.DisplayObject.js");

ASJS.Form = createClass(
"Form",
ASJS.Sprite,
function(_scope, _super) {
  _scope.new = function() {
    _super.new("form");
  }
  
  prop(_scope, "action", {
    get: function() { return _scope.getAttr("action"); },
    set: function(v) { _scope.setAttr("action", v); }
  });

  prop(_scope, "method", {
    get: function() { return _scope.getAttr("method"); },
    set: function(v) { _scope.setAttr("method", v); }
  });

  prop(_scope, "enctype", {
    get: function() { return _scope.getAttr("enctype"); },
    set: function(v) { _scope.setAttr("enctype", v); }
  });
  
  _scope.reset = function() {
    _scope.el.reset();
  }

  _scope.submit = function() {
    _scope.el.submit();
  }
});
cnst(ASJS.Form, "ENCTYPE_MULTIPART", "multipart/form-data");
