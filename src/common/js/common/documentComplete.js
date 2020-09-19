require("./minifyGlobal.js");

var isDocumentComplete = function() {
  return document.readyState === "complete";
}
var idc = isDocumentComplete;
