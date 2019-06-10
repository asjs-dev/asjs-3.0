createUtility(ASJS, "FileDragAndDropUtil");
rof(ASJS.FileDragAndDropUtil, "getFilesByEvent", function(e) {
  var files = [];

  var dt = e.dataTransfer;
  var i = -1;
  var type = dt["items"] ? "items" : "files";
  var f;
  while (f = dt[type][++i]) {
    if (type === "items") {
      if (f.kind === "file") files.push(f.getAsFile());
    } else files.push(f);
  }

  return files;
});
