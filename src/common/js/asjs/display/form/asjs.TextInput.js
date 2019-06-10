require("./asjs.AbstractTextElement.js");

createClass(ASJS, "TextInput", ASJS.AbstractTextElement, function(_scope, _super) {
  _scope.new = function() {
    _super.new("input");
    _scope.type = ASJS.TextInput.TYPE_TEXT;
  }

  prop(_scope, "type", {
    get: function() { return _scope.getAttr("type"); },
    set: function(v) { _scope.setAttr("type", v); }
  });
});
cnst(ASJS.TextInput, "TYPE_TEXT",     "text");
cnst(ASJS.TextInput, "TYPE_PASSWORD", "password");
cnst(ASJS.TextInput, "TYPE_EMAIL",    "email");
cnst(ASJS.TextInput, "TYPE_NUMBER",   "number");
