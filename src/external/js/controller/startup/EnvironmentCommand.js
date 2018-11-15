require("../../../../common/js/utils/urlParser/URLParser.js");
require("../../../../common/js/utils/dataUtils/Language.js");
require("../../../../common/js/utils/dataUtils/Cookies.js");

var EnvironmentCommand = createClass(
"EnvironmentCommand",
ASJS.AbstractCommand,
function(_scope) {
  var _language  = Language.instance;
  var _cookies   = Cookies;
  var _urlParser = URLParser.instance;

  _scope.execute = function() {
    setupLanguage();
  }

  function setupLanguage() {
    function validateLanguage(sl) {
      return empty(sl) || _language.supportedLanguages.indexOf(sl) === -1 ? null : sl;
    }
    var selectedLanguage = validateLanguage(_urlParser.getQueryParam('lang')) ||
                           validateLanguage(_cookies.readCookie('language')) ||
                           validateLanguage((navigator.language || navigator.userLanguage).split("-")[0]) ||
                           _language.selectedLanguage;
    _language.set("selectedLanguage", selectedLanguage);

    _cookies.createCookie('language', _language.selectedLanguage);
  }
});
