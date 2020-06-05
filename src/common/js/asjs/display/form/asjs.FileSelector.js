require("../../event/asjs.Event.js");
require("../../event/asjs.MouseEvent.js");
require("../asjs.DisplayObject.js");
require("./asjs.FormElement.js");

createClass(ASJS, "FileSelector", ASJS.FormElement, function(_scope, _super) {
  _super.protected.fileInput = new ASJS.DisplayObject("input");

  var _preview = new ASJS.Sprite();

  override(_scope, _super, "new");
  _scope.new = function() {
    _super.new();
    _super.protected.fileInput.setAttr("type", "file");
    _super.protected.fileInput.addEventListener(ASJS.Event.CHANGE, _super.protected.onChange);
    _super.protected.fileInput.visible = false;
    _scope.addChild(_super.protected.fileInput);

    _preview.setSize("100%", "100%");
    _preview.move(0, 0);
    _scope.addChild(_preview);

    _scope.addEventListener(ASJS.MouseEvent.CLICK, onClick);
  }

  get(_scope, "preview", function() { return _preview; });

  get(_scope, "val", function() { return _super.protected.fileInput.el.value; });

  get(_scope, "fileInput", function() { return _fileInput; });

  override(_scope, _super, "enabled");
  set(_scope, "enabled", function(v) {
    _super.enabled = _super.protected.fileInput.enabled = v;
  });

  prop(_scope, "name", {
    get: _super.protected.fileInput.getAttr.bind(_super.protected.fileInput, "name"),
    set: _super.protected.fileInput.setAttr.bind(_super.protected.fileInput, "name")
  });

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _super.protected.fileInput.destruct();
    _preview.destruct();

    _super.protected.fileInput =
    _preview                   = null;

    _super.destruct();
  }

  _super.protected.onChange = function() {
    _preview.text = _scope.val;
    _scope.dispatchEvent(ASJS.FileSelector.ON_CHANGE);
  }

  function onClick(e) {
    if (e.target === _super.protected.fileInput.el) return;
    _super.protected.fileInput.el.click();
  }
});
msg(ASJS.FileSelector, "ON_CHANGE");
