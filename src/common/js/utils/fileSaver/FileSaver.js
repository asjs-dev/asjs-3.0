require("../../helpers/constant.js");
require("../../helpers/typeIs.js");

require("../NameSpace.js");

ASJSUtils.FileSaver = {};
helpers.constant(ASJSUtils.FileSaver, "save", function(fileName, data, compress) {
  if (!fileName) fileName = 'untitled.json';
  var fileType = "application/json";

  if (helpers.typeIs(data, "object")) data = JSON.stringify(data);

  if (compress) {
    data = ASJS.LZW.encode(data);
    fileType = "octet/stream";
  }

  var blob = new Blob([data], {type: fileType});
  var url = URL.createObjectURL(blob);
  var link = new ASJS.Link();
      link.href = url;
      link.download = fileName;
      link.el.click();

  URL.revokeObjectURL(url);
});
