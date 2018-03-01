ASJS.import("org/asjs/mediator/AbstractResizeMediator.js");
ASJS.import("org/asjs/module/externalApplication/view/ExternalApplicationView.js");

var ExternalApplicationMediator = createClass(
"ExternalApplicationMediator",
AbstractResizeMediator,
function(_scope, _super) {
  var _externalApplicationView = new ExternalApplicationView();
  var _loader                  = new ASJS.ScriptLoader();
  
  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(ExternalApplicationMediator.SHOW, onShow);
    _super.protected.addHandler(ExternalApplicationMediator.HIDE, onHide);
    
    _externalApplicationView.addEventListener(ExternalApplicationMediator.CLOSE, onClose);

    _loader.addEventListener(ASJS.LoaderEvent.LOAD, onLoadExternalApplication);
    _loader.addEventListener(ASJS.LoaderEvent.PROGRESS, onProgressExternalApplication);
  }
  
  function onShow() {
    if (!_super.protected.view.contains(_externalApplicationView)) _super.protected.view.addChild(_externalApplicationView);
    loadExternalApplication();

    _super.protected.showView();
  }

  function onHide() {
    if (_super.protected.view.contains(_externalApplicationView)) _super.protected.view.removeChild(_externalApplicationView);
    unloadExternalApplication();
  }

  function onClose() {
    onHide();
  }

  function loadExternalApplication() {
    unloadExternalApplication();
    _loader.compressed = true;
    _loader.load("external/application.dat?v={{version}}");
  }

  function unloadExternalApplication() {
    _externalApplicationView.removeExternalApplication();
    _loader.cancel();
    _loader.unload();
  }

  function onLoadExternalApplication(e) {
    _externalApplicationView.addExternalApplication(new _loader.content());
    _loader.unload();
  }

  function onProgressExternalApplication(e) {
    _externalApplicationView.title = ((e.detail.loaded / e.detail.total) * 100) + "%";
  }
});
msg(ExternalApplicationMediator, "SHOW",  "show");
msg(ExternalApplicationMediator, "HIDE",  "hide");
msg(ExternalApplicationMediator, "CLOSE", "close");
