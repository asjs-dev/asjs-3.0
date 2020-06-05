require("./view/ExternalApplicationView.js");

createClass(NS, "ExternalApplicationMediator", ASJS.AbstractViewMediator, function(_scope, _super) {
  var _view = _super.protected.view = new NS.ExternalApplicationView();

  var _loader = new ASJS.ScriptLoader();

  override(_scope, _super, "new");
  _scope.new = function(root) {
    _super.new(root);

    _super.protected.addHandler(NS.ExternalApplicationMediator.SHOW, onShow);
    _super.protected.addHandler(NS.ExternalApplicationMediator.HIDE, onHide);

    _view.addEventListener(NS.ExternalApplicationMediator.CLOSE, onClose);

    _loader.addEventListener(ASJS.LoaderEvent.LOAD,     onLoadExternalApplication);
    _loader.addEventListener(ASJS.LoaderEvent.PROGRESS, onProgressExternalApplication);
  }

  function onShow() {
    _super.protected.show();
    loadExternalApplication();
  }

  function onHide() {
    _super.protected.hide();
    unloadExternalApplication();
  }

  var onClose = onHide;

  function loadExternalApplication() {
    unloadExternalApplication();
    _loader.compressed = true;
    _loader.load("external/application.dat?v={{date}}");
  }

  function unloadExternalApplication() {
    _view.removeExternalApplication();
    _loader.cancel();
    _loader.unload();
  }

  function onLoadExternalApplication(e) {
    _view.addExternalApplication(_loader.content);
    _loader.unload();
  }

  function onProgressExternalApplication(e) {
    _view.title = ((e.detail.loaded / e.detail.total) * 100) + "%";
  }
});
msg(NS.ExternalApplicationMediator, "SHOW");
msg(NS.ExternalApplicationMediator, "HIDE");
msg(NS.ExternalApplicationMediator, "CLOSE");
