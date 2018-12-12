require("../../../../common/js/utils/urlParser/URLParser.js");
require("../../../../common/js/utils/dataUtils/Language.js");
require("../../../../common/js/utils/dataUtils/Cookies.js");
require("../../../../common/js/utils/dataUtils/Config.js");

var EnvironmentCommand = createClass(
"EnvironmentCommand",
ASJS.AbstractCommand,
function(_scope) {
  var _language  = Language.instance;
  var _cookies   = Cookies;
  var _config    = Config.instance;
  var _urlParser = URLParser.instance;
  var _sleepToResizeId;

  _scope.execute = function() {
    setupLanguage();
    setupStage();
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
    document.title = _language.getText("title");
  }

  function setupStage() {
    stage.addEventListener(ASJS.Stage.RESIZE, onStageResize);
  }

  function onStageResize() {
    _sleepToResizeId = clearTimeout(_sleepToResizeId);
    _sleepToResizeId = setTimeout(onTimeout, _config.get("resizeInterval"));
  }

  function onTimeout() {
    _sleepToResizeId = clearTimeout(_sleepToResizeId);
    requestAnimationFrame(function() {
      _scope.sendNotification(ASJS.Stage.RESIZE);
    });
  }
});
