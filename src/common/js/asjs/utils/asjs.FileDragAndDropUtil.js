ASJS.FileDragAndDropUtil = {};
helpers.constant(ASJS.FileDragAndDropUtil, "getFilesByEvent", function(e) {
  var files = [];

  var dt = e.dataTransfer;
  var i = -1;
  var type = dt["items"] ? "items" : "files";
  var f;
  while (f = dt[type][++i]) {
    type === "items"
      ? f.kind === "file" && files.push(f.getAsFile())
      : files.push(f);
  }

  return files;
});
