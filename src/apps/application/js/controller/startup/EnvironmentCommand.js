require("../../../../../common/js/common/urlParser/URLParser.js");
require("../../../../../common/js/common/dataUtils/Language.js");
require("../../../../../common/js/common/dataUtils/Config.js");
require("../../../../../common/js/common/dataUtils/Cookies.js");

var EnvironmentCommand = createClass(
"EnvironmentCommand",
ASJS.AbstractCommand,
function(_scope) {
  var _language  = Language.instance;
  var _cookies   = Cookies.instance;
  var _cycler    = ASJS.Cycler.instance;
  var _config    = Config.instance;
  var _urlParser = URLParser.instance;
  var _sleepToResizeId;

  _scope.execute = function() {
    setupLanguage();
    setupCycler();
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

  function setupCycler() {
    _cycler.fps = _config.get("fps");
    _cycler.start();
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
