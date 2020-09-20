require("./NameSpace.js");

helpers.isDocumentComplete = helpers.isDocumentComplete || function() {
  return document.readyState === "complete";
}
