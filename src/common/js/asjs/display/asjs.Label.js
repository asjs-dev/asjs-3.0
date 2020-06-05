require("./asjs.DisplayObject.js");

createClass(ASJS, "Label", ASJS.DisplayObject, function(_scope, _super) {
  override(_scope, _super, "new");
  _scope.new = _super.new.bind(_scope, "label");

  ASJS.Tag.attrProp(_scope, "for");
});
