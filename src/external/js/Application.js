require("../../common/js/helpers/createClass.js");
require("../../common/js/helpers/property.js");
require("../../common/js/utils/dataUtils/Language.js");
require("../../common/js/utils/dataUtils/Config.js");

require("./NameSpace.js");
require("./controller/DestructCommand.js");
require("./controller/StartupCommand.js");

helpers.createClass(NS, "Application", ASJS.Sprite, function(_scope, _super) {
  var _language       = ASJSUtils.Language.instance;
  var _config         = ASJSUtils.Config.instance;
  var _styleLoader    = new ASJS.StyleLoader();
  var _languageLoaded = false;

  helpers.override(_scope, _super, "new");
  _scope.new = function() {
    _super.new();

    _scope.addClass("external-application");

    console.log("<AS/JS> External Application {{appVersion}}.{{date}}");

    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE, addedToStage);
  }

  helpers.get(_scope, "title", function() { return _language.getText("title"); });

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    (new NS.DestructCommand()).execute();
    _styleLoader.destruct();
    _language.clear();
    _config.clear();

    _styleLoader =
    _language    =
    _config      = null;

    _super.destruct();
  }

  function addedToStage(event) {
    if (event.target !== _scope.el) return;

    _scope.removeEventListener(ASJS.Stage.ADDED_TO_STAGE, addedToStage);

    _styleLoader.addEventListener(ASJS.LoaderEvent.LOAD, onStyleLoaded);
    _styleLoader.compressed = true;
    _styleLoader.load("external/style.dat?v={{date}}");

    _language.addEventListener(ASJS.AbstractModel.CHANGED, onLanguageChanged);
  }

  function onStyleLoaded() {
    _styleLoader.removeEventListener(ASJS.LoaderEvent.LOAD, onStyleLoaded);
    _styleLoader.useStyle();
    (new NS.StartupCommand()).execute(_scope);
  }

  function onLanguageChanged() {
    _language.removeEventListener(ASJS.AbstractModel.CHANGED, onLanguageChanged);
    if (_languageLoaded) return;
    _languageLoaded = true;
    _scope.dispatchEvent(ASJS.LoaderEvent.LOAD);
  }
});
// -------------------- //
return NS.Application;
