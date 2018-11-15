var Language = createSingletonClass(
"Language",
ASJS.AbstractModel,
function(_scope) {
  get(_scope, "supportedLanguages", function() { return _scope.get("supportedLanguages"); });

  get(_scope, "selectedLanguage", function() { return _scope.get("selectedLanguage"); });

  get(_scope, "defaultLanguage", function() { return _scope.get("defaultLanguage"); });

  _scope.getText = function(k, o) {
    var i = _scope.get("elements")[k];
    if (!empty(i) && (!empty(i[_scope.selectedLanguage]) || !empty(i[_scope.defaultLanguage]))) {
      var text = i[_scope.selectedLanguage] || i[_scope.defaultLanguage];
      if (o) {
        map(o, function(id, item) {
          text = text.replace("{{" + id + "}}", item);
        });
      }
      return text;
    }
    console.warn("Missing translation:", k);
    return k;
  }
});
