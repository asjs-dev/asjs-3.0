var Language = createSingletonClass(
"Language",
ASJS.AbstractModel,
function(_scope, _super) {
  get(_scope, "supportedLanguages", function() { return _super.data.supportedLanguages; });

  get(_scope, "selectedLanguage", function() { return _super.data.selectedLanguage; });

  _scope.getText = function(k, o) {
    var i = _scope.get("elements")[k];
    if (!empty(i) && !empty(i[_scope.selectedLanguage])) {
      var text = i[_scope.selectedLanguage];
      if (o) {
        for (var id in o) {
          text = text.replace("{{" + id + "}}", o[id]);
        }
      }
      return text;
    }
    return "";
  }
});
