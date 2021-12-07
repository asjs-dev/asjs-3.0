import helpers from "./NameSpace.js";

helpers.isDocumentComplete = function() {
  return document.readyState === "complete";
}
