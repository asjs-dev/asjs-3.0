require("./asjs.FileSelector.js");

createClass(ASJS, "ImageSelector", ASJS.FileSelector, function(_scope, _super) {
  var _reader = new FileReader();

  _scope.new = function() {
    _super.new();
    _reader.onload = readerOnLoad;
  }

  _super.protected.onChange = function() {
    var target = _super.protected.fileInput.el;
    if (target.files && target.files[ 0 ]) {
      _scope.dispatchEvent(ASJS.ImageSelector.ON_CHANGE_START);
      _reader.readAsDataURL(target.files[ 0 ]);
    }
  }

  _scope.destruct = function() {
    _reader = null;

    _super.destruct();
  }

  function readerOnLoad(e) {
    _scope.preview.setCSS('background-image', 'url(' + e.target.result + ')');
    _scope.dispatchEvent(ASJS.FileSelector.ON_CHANGE);
  }
});
msg(ASJS.ImageSelector, "ON_CHANGE_START");
