ASJS.Color = createClass(
"Color",
ASJS.BaseClass,
function(_scope) {
  _scope.new = function(r, g, b, a) {
    _scope.r = r || 0;
    _scope.g = g || 0;
    _scope.b = b || 0;
    _scope.a = a || 255;
  }

  prop(_scope, "alpha", {
    get: function() { return _scope.a / 255; },
    set: function(v) { _scope.a = (v || 1) * 255; }
  });
});

rof(ASJS.Color, "twoColorDistance", function(c1, c2) {
  var d =
    Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) +
    Math.abs(c1.b - c2.b) + Math.abs(c1.a - c2.a);
  return d;
});

rof(ASJS.Color, "colorToString", function(color) {
  return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.alpha + ")";
});

rof(ASJS.Color, "valuesFromHex", function(hex) {
  return hex.replace(/^(#|0x)/, "").match(/.{1,2}/g);
});

rof(ASJS.Color, "intToHex", function(v) {
  var hex = (v || 0).toString(16);
  return (hex.length < 2 ? "0" : "") + hex;
});

rof(ASJS.Color, "rgbHexToColor", function(hex) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 3) result.unshift(0);
  return new ASJS.Color(
    parseInt(result[0], 16) || 0,
    parseInt(result[1], 16) || 0,
    parseInt(result[2], 16) || 0
  );
});

rof(ASJS.Color, "rgbaHexToColor", function(hex) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  return new ASJS.Color(
    parseInt(result[0], 16) || 0,
    parseInt(result[1], 16) || 0,
    parseInt(result[2], 16) || 0,
    parseInt(result[3], 16) || 255
  );
});

rof(ASJS.Color, "argbHexToColor", function(hex) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  return new ASJS.Color(
    parseInt(result[1], 16) || 0,
    parseInt(result[2], 16) || 0,
    parseInt(result[3], 16) || 0,
    parseInt(result[0], 16) || 255
  );
});

rof(ASJS.Color, "abgrHexToColor", function(hex) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  return new ASJS.Color(
    parseInt(result[3], 16) || 0,
    parseInt(result[2], 16) || 0,
    parseInt(result[1], 16) || 0,
    parseInt(result[0], 16) || 255
  );
});

rof(ASJS.Color, "colorToRgbHex", function(color) {
  return ASJS.Color.intToHex(color.r) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.b);
});

rof(ASJS.Color, "colorToRgbaHex", function(color) {
  return ASJS.Color.intToHex(color.r) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.b) +
         ASJS.Color.intToHex(color.a);
});

rof(ASJS.Color, "colorToArgbHex", function(color) {
  return ASJS.Color.intToHex(color.a) +
         ASJS.Color.intToHex(color.r) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.b);
});

rof(ASJS.Color, "colorToAbgrHex", function(color) {
  return ASJS.Color.intToHex(color.a) +
         ASJS.Color.intToHex(color.b) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.r);
});

rof(ASJS.Color, "rgbIntToColor", function(int) {
  return ASJS.Color.rgbHexToColor(int.toString(16));
});

rof(ASJS.Color, "rgbaIntToColor", function(int) {
  return ASJS.Color.rgbaHexToColor(int.toString(16));
});

rof(ASJS.Color, "argbIntToColor", function(int) {
  return ASJS.Color.argbHexToColor(int.toString(16));
});

rof(ASJS.Color, "abgrIntToColor", function(int) {
  return ASJS.Color.abgrHexToColor(int.toString(16));
});

rof(ASJS.Color, "colorToRgbInt", function(color) {
  return parseInt(ASJS.Color.colorToRgbHex(color), 16);
});

rof(ASJS.Color, "colorToRgbaInt", function(color) {
  return parseInt(ASJS.Color.colorToRgbaHex(color), 16);
});

rof(ASJS.Color, "colorToArgbInt", function(color) {
  return parseInt(ASJS.Color.colorToArgbHex(color), 16);
});

rof(ASJS.Color, "colorToAbgrInt", function(color) {
  return parseInt(ASJS.Color.colorToAbgrHex(color), 16);
});
