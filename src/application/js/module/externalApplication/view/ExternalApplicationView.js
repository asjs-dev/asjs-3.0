require("../../../../../common/js/utils/dataUtils/Language.js");
require("../../../../../common/js/view/AbstractView.js");
require("../ExternalApplicationMediator.js");

createClass(NS, "ExternalApplicationView", ASJSUtils.AbstractView, function(_scope, _super) {
  var _language = ASJSUtils.Language.instance;
  var _mouse    = ASJS.Mouse.instance;

  var _container                    = new ASJS.Sprite();
  var _title                        = new ASJS.Label();
  var _closeButton                  = new ASJS.DisplayObject();
  var _externalApplicationContainer = new ASJS.Sprite();

  var _externalApplication;

  _scope.new = function() {
    _super.new();

    _scope.addClass("external-application-view");
    _scope.setCSS("position", "fixed");

    _container.addClass("container");
    _scope.addChild(_container);

    _title.addClass("title-label");
    _container.addChild(_title);

    _closeButton.addClass("close-button");
    _closeButton.addEventListener(ASJS.MouseEvent.CLICK, onCloseClick);
    _container.addChild(_closeButton);

    _externalApplicationContainer.addClass("external-application-container");
    _container.addChild(_externalApplicationContainer);
  }

  set(_scope, "title", function(v) { _title.text = v; });

  _scope.addExternalApplication = function(externalApplication) {
    _scope.removeExternalApplication();
    _externalApplication = new externalApplication();
    _externalApplication.addEventListener(ASJS.LoaderEvent.LOAD, function() {
      _externalApplication.removeEventListener(ASJS.LoaderEvent.LOAD);
      _scope.title = _externalApplication.title;
    });
    _externalApplicationContainer.addChild(_externalApplication);
    _scope.render();
  }

  _scope.removeExternalApplication = function() {
    if (!_externalApplication) return;
    _externalApplicationContainer.removeChild(_externalApplication);
    _externalApplication.destruct();
    _externalApplication = null;
  }

  function onCloseClick() {
    _super.protected.animateTo(0, function() {
      _scope.dispatchEvent(NS.ExternalApplicationMediator.CLOSE);
    });
  }
});
