require("./asjs.AbstractTextElement.js");

helpers.createClass(ASJS, "TextArea", ASJS.AbstractTextElement, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = _super.new.bind(_scope, "textarea");
});
