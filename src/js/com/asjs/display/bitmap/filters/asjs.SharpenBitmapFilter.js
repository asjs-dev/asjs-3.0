ASJS.import("com/asjs/display/bitmap/filters/asjs.AbstractConvoluteBitmapFilter.js");

ASJS.SharpenBitmapFilter = createClass(
"SharpenBitmapFilter",
ASJS.AbstractConvoluteBitmapFilter,
function(_scope, _super) {
  get(_super.protected, "matrix", function() {
    return [
       0, -1,  0,
      -1,  5, -1,
       0, -1,  0
    ];
  });
});
