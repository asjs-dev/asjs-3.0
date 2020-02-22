createClass(ASJS, "FormElement", ASJS.Sprite, function(_scope, _super) {
  _scope.new = function(tag) {
    _super.new(tag);
    _scope.tabindex = "auto";
  }

  ASJS.Tag.attrProp(_scope, "name");
});
