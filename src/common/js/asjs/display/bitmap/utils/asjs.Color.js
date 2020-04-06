createClass(ASJS, "Color", ASJS.BaseClass, function(_scope) {
  _scope.new = function(r, g, b, a) {
    _scope.set(r, g, b, a);
  }

  _scope.set = function(r, g, b, a) {
    _scope.r = r || 0;
    _scope.g = g || 0;
    _scope.b = b || 0;
    _scope.a = tis(a, "number") ? a : 1;
  }

  get(_scope, "floatAlpha", function() {
    return _scope.a / 255;
  });

  _scope.setVector = function(v) {
    _scope.set(v[0], v[1], v[2], v[3]);
  }

  _scope.getVector = function() {
    return [_scope.r, _scope.g, _scope.b, _scope.a];
  }

  get(_scope, "isGray", function() {
    return _scope.r === _scope.g && _scope.g === _scope.b;
  });

  get(_scope, "isWhite", function() {
    return _scope.r === 255 && _scope.isGray;
  });

  get(_scope, "isBlack", function() {
    return _scope.r === 0 && _scope.isGray;
  });
});

rof(ASJS.Color, "twoColorDistance", function(c1, c2) {
  return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) +
         Math.abs(c1.b - c2.b) + Math.abs(c1.a - c2.a);
});

rof(ASJS.Color, "colorToString", function(color) {
  return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
});

rof(ASJS.Color, "valuesFromHex", function(hex) {
  return hex.replace(/^(#|0x)/, "").match(/.{1,2}/g);
});

rof(ASJS.Color, "hexStringToInt", function(hex) {
  return parseInt(hex.replace(/#|0x/, ""), 16);
});

rof(ASJS.Color, "intToHex", function(v) {
  var hex = (v || 0).toString(16);
  return (hex.length < 2 ? "0" : "") + hex;
});

rof(ASJS.Color, "rgbHexToColor", function(hex, colorObject) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 3) result.unshift(0);
  if (!colorObject) colorObject = new ASJS.Color();
  colorObject.set(
    parseInt(result[0], 16) || 0,
    parseInt(result[1], 16) || 0,
    parseInt(result[2], 16) || 0
  );
  return colorObject;
});

rof(ASJS.Color, "rgbaHexToColor", function(hex, colorObject) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  if (!colorObject) colorObject = new ASJS.Color();
  colorObject.set(
    parseInt(result[0], 16) || 0,
    parseInt(result[1], 16) || 0,
    parseInt(result[2], 16) || 0,
    parseInt(result[3], 16) || 1
  );
  return colorObject;
});

rof(ASJS.Color, "argbHexToColor", function(hex, colorObject) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  if (!colorObject) colorObject = new ASJS.Color();
  colorObject.set(
    parseInt(result[1], 16) || 0,
    parseInt(result[2], 16) || 0,
    parseInt(result[3], 16) || 0,
    parseInt(result[0], 16) || 1
  );
  return colorObject;
});

rof(ASJS.Color, "abgrHexToColor", function(hex, colorObject) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  if (!colorObject) colorObject = new ASJS.Color();
  colorObject.set(
    parseInt(result[3], 16) || 0,
    parseInt(result[2], 16) || 0,
    parseInt(result[1], 16) || 0,
    parseInt(result[0], 16) || 1
  );
  return colorObject;
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

rof(ASJS.Color, "rgbIntToColor", function(int, colorObject) {
  return ASJS.Color.rgbHexToColor(int.toString(16), colorObject);
});

rof(ASJS.Color, "rgbaIntToColor", function(int, colorObject) {
  return ASJS.Color.rgbaHexToColor(int.toString(16), colorObject);
});

rof(ASJS.Color, "argbIntToColor", function(int, colorObject) {
  return ASJS.Color.argbHexToColor(int.toString(16), colorObject);
});

rof(ASJS.Color, "abgrIntToColor", function(int, colorObject) {
  return ASJS.Color.abgrHexToColor(int.toString(16), colorObject);
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

rof(ASJS.Color, "clone", function(color) {
  return new ASJS.Color(color.r, color.g, color.b, color.a);
});
