ASJS.import("com/asjs/display/asjs.DisplayObject.js");

ASJS.IFrame = createClass(
"IFrame",
ASJS.DisplayObject,
function(_scope, _super) {
  _scope.new = function() {
    _super.new("iframe");
  }

  prop(_scope, "src", {
    get: function() { return _scope.getAttr("src"); },
    set: function(v) { _scope.setAttr("src", v); }
  });

  _scope.isLoaded = function() {
    return _scope.el.contentDocument.title.indexOf("404") == -1;
  }

  _scope.sendMessage = function(data) {
    _scope.el.contentWindow.postMessage(data, "*");
  }
});
