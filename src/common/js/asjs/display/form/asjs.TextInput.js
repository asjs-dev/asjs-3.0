require("./asjs.AbstractTextElement.js");

createClass(ASJS, "TextInput", ASJS.AbstractTextElement, function(_scope, _super) {
  override(_scope, _super, "new");
  _scope.new = function() {
    _super.new("input");
    _scope.type = ASJS.TextInput.TYPE_TEXT;
  }

  ASJS.Tag.attrProp(_scope, "type");
});
cnst(ASJS.TextInput, "TYPE_TEXT",     "text");
cnst(ASJS.TextInput, "TYPE_PASSWORD", "password");
cnst(ASJS.TextInput, "TYPE_EMAIL",    "email");
cnst(ASJS.TextInput, "TYPE_NUMBER",   "number");
