require("./asjs.DisplayObject.js");

createClass(ASJS, "IFrame", ASJS.DisplayObject, function(_scope, _super) {
  _scope.new = _super.new.bind(_scope, "iframe");

  ASJS.Tag.attrProp(_scope, "src");

  _scope.isLoaded = function() {
    return _scope.el.contentDocument.title.indexOf("404") === -1;
  }

  _scope.sendMessage = function(data) {
    _scope.el.contentWindow.postMessage(data, "*");
  }
});
