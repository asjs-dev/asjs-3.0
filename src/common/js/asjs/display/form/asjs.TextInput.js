require("./asjs.AbstractTextElement.js");

helpers.createClass(ASJS, "TextInput", ASJS.AbstractTextElement, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = function() {
    _super.new("input");
    _scope.type = ASJS.TextInput.TYPE_TEXT;
  }

  ASJS.Tag.attrProp(_scope, "type");
});
helpers.constant(ASJS.TextInput, "TYPE_TEXT",     "text");
helpers.constant(ASJS.TextInput, "TYPE_PASSWORD", "password");
helpers.constant(ASJS.TextInput, "TYPE_EMAIL",    "email");
helpers.constant(ASJS.TextInput, "TYPE_NUMBER",   "number");
