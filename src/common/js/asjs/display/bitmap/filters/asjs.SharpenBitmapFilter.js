require("./asjs.AbstractConvoluteBitmapFilter.js");

helpers.createClass(ASJS, "SharpenBitmapFilter", ASJS.AbstractConvoluteBitmapFilter, function(_scope, _super) {
  helpers.get(_super.protected, "matrix", function() {
    return [
       0, -1,  0,
      -1,  5, -1,
       0, -1,  0
    ];
  });
});
