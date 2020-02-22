require("../asjs.DisplayObject.js");

createClass(ASJS, "Form", ASJS.Sprite, function(_scope, _super) {
  _scope.new = _super.new.bind(_scope, "form");

  ASJS.Tag.attrProp(_scope, "action");
  ASJS.Tag.attrProp(_scope, "method");
  ASJS.Tag.attrProp(_scope, "enctype");

  _scope.reset = function() {
    _scope.el.reset();
  }

  _scope.submit = function() {
    _scope.el.submit();
  }
});
cnst(ASJS.Form, "ENCTYPE_MULTIPART", "multipart/form-data");
