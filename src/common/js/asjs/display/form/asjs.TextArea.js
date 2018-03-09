require("display/form/asjs.AbstractTextElement.js");

ASJS.TextArea = createClass(
"TextArea",
ASJS.AbstractTextElement,
function(_scope, _super) {
  _scope.new = function() {
    _super.new("textarea");
  }
});
