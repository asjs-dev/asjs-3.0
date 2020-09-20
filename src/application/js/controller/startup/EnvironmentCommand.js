require("../../../../common/js/helpers/createClass.js");
require("../../../../common/js/helpers/throttleFunction.js");
require("../../../../common/js/helpers/isEmpty.js");
require("../../../../common/js/helpers/inArray.js");

require("../../../../common/js/utils/urlParser/URLParser.js");
require("../../../../common/js/utils/dataUtils/Language.js");
require("../../../../common/js/utils/dataUtils/Cookies.js");
require("../../../../common/js/utils/dataUtils/Config.js");

require("../../NameSpace.js");

helpers.createClass(NS, "EnvironmentCommand", ASJS.AbstractCommand, function(_scope, _super) {
  var _language  = ASJSUtils.Language.instance;
  var _cookies   = ASJSUtils.Cookies;
  var _config    = ASJSUtils.Config.instance;
  var _urlParser = ASJSUtils.URLParser.instance;

  _scope.execute = function() {
    setupLanguage();
    setupStage();
  }

  function setupLanguage() {
    function validateLanguage(sl) {
      return helpers.isEmpty(sl) || !helpers.inArray(_language.supportedLanguages, sl) ? null : sl;
    }
    var selectedLanguage = validateLanguage(_urlParser.getQueryParam('lang')) ||
                           validateLanguage(_cookies.readCookie('language')) ||
                           validateLanguage((navigator.language || navigator.userLanguage).split("-")[0]) ||
                           _language.selectedLanguage;
    _language.set("selectedLanguage", selectedLanguage);

    _cookies.createCookie('language', _language.selectedLanguage);
    document.title = _language.getText("title");
  }

  function setupStage() {
    stage.addEventListener(ASJS.Stage.RESIZE, onStageResize);
  }

  var onStageResize = helpers.throttleFunction(function() {
    _super.protected.sendNotification(ASJS.Stage.RESIZE);
  })
});
