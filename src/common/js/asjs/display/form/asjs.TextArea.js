require("./asjs.AbstractTextElement.js");

createClass(ASJS, "TextArea", ASJS.AbstractTextElement, function(_scope, _super) {
  override(_scope, _super, "new");
  _scope.new = _super.new.bind(_scope, "textarea");
});
