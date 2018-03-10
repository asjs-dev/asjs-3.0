require("../../com/dataUtils/Language.js");
require("../../com/dataUtils/Config.js");
require("./controller/StartupCommand.js");

var Application = createClass(
"Application",
ASJS.Sprite,
function(_scope, _super) {
  var _language       = Language.instance;
  var _config         = Config.instance;
  var _styleLoader    = new ASJS.StyleLoader();
  var _languageLoaded = false;
  
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> External Application {{version}}");
    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE, addedToStage);
  }
  
  get(_scope, "title", function() { return _language.getText("title"); });
  
  _scope.destruct = function() {
    _styleLoader.unload();
    _language.clear();
    _config.clear();
  }
  
  function addedToStage() {
    _styleLoader.addEventListener(ASJS.LoaderEvent.LOAD, onStyleLoaded);
    _styleLoader.compressed = true;
    _styleLoader.load("external/style.dat");
    
    _language.addEventListener(ASJS.AbstractModel.CHANGED, onLanguageChanged);
  }
  
  function onStyleLoaded() {
    _styleLoader.useStyle();
    (new StartupCommand()).execute(_scope);
  }
  
  function onLanguageChanged() {
    if (_languageLoaded) return;
    _languageLoaded = true;
    _scope.dispatchEvent(ASJS.LoaderEvent.LOAD);
  }
});
// -------------------- //
ASJS.start(Application);
