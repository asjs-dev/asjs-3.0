require("./minifyGlobal.js");

var isDocumentComplete = function() {
  return _d.readyState === "complete";
}
var idc = isDocumentComplete;