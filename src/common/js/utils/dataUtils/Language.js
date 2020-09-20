require("../../helpers/createClass.js");
require("../../helpers/isEmpty.js");
require("../../helpers/property.js");
require("../../helpers/map.js");

require("../NameSpace.js");

helpers.createSingletonClass(ASJSUtils, "Language", ASJS.AbstractModel, function(_scope) {
  helpers.get(_scope, "supportedLanguages", function() { return _scope.get("supportedLanguages"); });

  helpers.get(_scope, "selectedLanguage", function() { return _scope.get("selectedLanguage"); });

  helpers.get(_scope, "defaultLanguage", function() { return _scope.get("defaultLanguage"); });

  _scope.getText = function(k, o) {
    var i = _scope.get("elements")[k];
    if (!helpers.isEmpty(i) && (!helpers.isEmpty(i[_scope.selectedLanguage]) || !helpers.isEmpty(i[_scope.defaultLanguage]))) {
      var text = i[_scope.selectedLanguage] || i[_scope.defaultLanguage];
      if (o) {
        helpers.map(o, function(id, item) {
          text = text.replace("{{" + id + "}}", item);
        });
      }
      return text;
    }
    console.warn("Missing translation:", k);
    return k;
  }
});
