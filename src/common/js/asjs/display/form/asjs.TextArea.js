require("./asjs.AbstractTextElement.js");

createClass(ASJS, "TextArea", ASJS.AbstractTextElement, function(_scope, _super) {
  _scope.new = _super.new.bind(_scope, "textarea");
});
