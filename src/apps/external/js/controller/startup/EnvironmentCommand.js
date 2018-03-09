require("com/urlParser/URLParser.js");
require("com/dataUtils/Language.js");
require("com/dataUtils/Cookies.js");

var EnvironmentCommand = createClass(
"EnvironmentCommand",
ASJS.AbstractCommand,
function(_scope) {
  var _language  = Language.instance;
  var _cookies   = Cookies.instance;
  var _urlParser = URLParser.instance;
  
  _scope.execute = function() {
    setupLanguage();
  }
  
  function setupLanguage() {
    function validateLanguage(sl) {
      return empty(sl) || _language.supportedLanguages.indexOf(sl) === -1;
    }
    var selectedLanguage = _urlParser.getQueryParam('lang');
    if (validateLanguage(selectedLanguage)) selectedLanguage = _cookies.readCookie('language');
    if (validateLanguage(selectedLanguage)) selectedLanguage = _language.selectedLanguage;
    _language.set("selectedLanguage", selectedLanguage);

    _cookies.createCookie('language', _language.selectedLanguage);
  }
});
