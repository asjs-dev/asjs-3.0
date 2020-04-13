createUtility(ASJS, "Color");
rof(ASJS.Color, "create", function(r, g, b, a) {
  return ASJS.Color.set({}, r, g, b, a);
});

rof(ASJS.Color, "set", function(c, r, g, b, a) {
  c.r = tis(r, "number") ? r : (!empty(c.r) ? c.r : 0);
  c.g = tis(g, "number") ? g : (!empty(c.g) ? c.g : 0);
  c.b = tis(b, "number") ? b : (!empty(c.b) ? c.b : 0);
  c.a = tis(a, "number") ? a : (!empty(c.a) ? c.a : 1);
  return c;
});

rof(ASJS.Color, "parse", function(v) {
  if (tis(v, "number") || parseFloat(v) == v) return ASJS.Color.rgbIntToColor(v);
  if (tis(v, "string")) {
    if (v.length > 7) return ASJS.Color.rgbaHexToColor(v);
    return ASJS.Color.rgbHexToColor(v);
  }
  return v;
});

rof(ASJS.Color, "isGray", function(c) {
  return c.r === c.g && c.g === c.b;
});

rof(ASJS.Color, "isWhite", function(c) {
  return c.r === 255 && ASJS.Color.isGray(c);
});

rof(ASJS.Color, "isBlack", function(c) {
  return c.r === 0 && ASJS.Color.isGray(c);
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
  if (!colorObject) colorObject = ASJS.Color.create();
  ASJS.Color.set(
    colorObject,
    parseInt(result[0], 16),
    parseInt(result[1], 16),
    parseInt(result[2], 16)
  );
  return colorObject;
});

rof(ASJS.Color, "rgbaHexToColor", function(hex, colorObject) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  if (!colorObject) colorObject = ASJS.Color.create();
  ASJS.Color.set(
    colorObject,
    parseInt(result[0], 16),
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  );
  return colorObject;
});

rof(ASJS.Color, "argbHexToColor", function(hex, colorObject) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  if (!colorObject) colorObject = ASJS.Color.create();
  ASJS.Color.set(
    colorObject,
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
    parseInt(result[0], 16)
  );
  return colorObject;
});

rof(ASJS.Color, "abgrHexToColor", function(hex, colorObject) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  if (!colorObject) colorObject = ASJS.Color.create();
  ASJS.Color.set(colorObject,
    parseInt(result[3], 16),
    parseInt(result[2], 16),
    parseInt(result[1], 16),
    parseInt(result[0], 16)
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
         ASJS.Color.intToHex(color.a * 255);
});

rof(ASJS.Color, "colorToArgbHex", function(color) {
  return ASJS.Color.intToHex(color.a * 255) +
         ASJS.Color.intToHex(color.r) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.b);
});

rof(ASJS.Color, "colorToAbgrHex", function(color) {
  return ASJS.Color.intToHex(color.a * 255) +
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
  return ASJS.Color.create(color.r, color.g, color.b, color.a);
});
