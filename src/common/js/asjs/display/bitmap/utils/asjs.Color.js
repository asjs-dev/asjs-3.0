ASJS.Color = {};
helpers.constant(ASJS.Color, "create", function(r, g, b, a) {
  return ASJS.Color.set(r, g, b, a);
});

helpers.constant(ASJS.Color, "createFloat", function(r, g, b, a) {
  return ASJS.Color.setFloat(r, g, b, a);
});

helpers.constant(ASJS.Color, "set", function(r, g, b, a, dst) {
  dst = dst || {};
  dst.r = helpers.valueOrDefault(r, 0);
  dst.g = helpers.valueOrDefault(g, 0);
  dst.b = helpers.valueOrDefault(b, 0);
  dst.a = helpers.valueOrDefault(a, 1);
  return dst;
});

helpers.constant(ASJS.Color, "setFloat", function(r, g, b, a, dst) {
  dst = dst || new Float32Array(4);
  dst[0] = helpers.valueOrDefault(r, 0);
  dst[1] = helpers.valueOrDefault(g, 0);
  dst[2] = helpers.valueOrDefault(b, 0);
  dst[3] = helpers.valueOrDefault(a, 1);
  return dst;
});

helpers.constant(ASJS.Color, "multiply", function(a, b, dst) {
  return ASJS.Color.set(
    (a.r * b.r) / 255,
    (a.g * b.g) / 255,
    (a.b * b.b) / 255,
    a.a * b.a,
    dst
  );
});

helpers.constant(ASJS.Color, "toFloat", function(v, dst) {
  return ASJS.Color.setFloat(
    v.r / 255,
    v.g / 255,
    v.b / 255,
    v.a,
    dst
  );
});

helpers.constant(ASJS.Color, "fromFloat", function(v, dst) {
  return ASJS.Color.set(
    Math.floor(v[0] * 255),
    Math.floor(v[1] * 255),
    Math.floor(v[2] * 255),
    v[3],
    dst
  );
});

helpers.constant(ASJS.Color, "parse", function(v, dst) {
  if (helpers.typeIs(v, "number") || parseFloat(v) == v) return ASJS.Color.rgbIntToColor(v, dst);
  if (helpers.typeIs(v, "string")) {
    if (v.length > 7) return ASJS.Color.rgbaHexToColor(v, dst);
    return ASJS.Color.rgbHexToColor(v, dst);
  }
  return v;
});

helpers.constant(ASJS.Color, "isGray", function(c) {
  return c.r === c.g && c.g === c.b;
});

helpers.constant(ASJS.Color, "isWhite", function(c) {
  return c.r === 255 && ASJS.Color.isGray(c);
});

helpers.constant(ASJS.Color, "isBlack", function(c) {
  return c.r === 0 && ASJS.Color.isGray(c);
});

helpers.constant(ASJS.Color, "twoColorDistance", function(c1, c2) {
  return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) +
         Math.abs(c1.b - c2.b) + Math.abs(c1.a - c2.a);
});

helpers.constant(ASJS.Color, "colorToString", function(color) {
  return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
});

helpers.constant(ASJS.Color, "valuesFromHex", function(hex) {
  return hex.replace(/^(#|0x)/, "").match(/.{1,2}/g);
});

helpers.constant(ASJS.Color, "hexStringToInt", function(hex) {
  return parseInt(hex.replace(/#|0x/, ""), 16);
});

helpers.constant(ASJS.Color, "intToHex", function(v) {
  var hex = (v || 0).toString(16);
  return (hex.length < 2 ? "0" : "") + hex;
});

helpers.constant(ASJS.Color, "rgbHexToColor", function(hex, dst) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 3) result.unshift(0);
  return ASJS.Color.set(
    parseInt(result[0], 16),
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    1,
    dst
  );
});

helpers.constant(ASJS.Color, "rgbaHexToColor", function(hex, dst) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  return ASJS.Color.set(
    parseInt(result[0], 16),
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
    dst
  );
});

helpers.constant(ASJS.Color, "argbHexToColor", function(hex, dst) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  return ASJS.Color.set(
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
    parseInt(result[0], 16),
    dst
  );
});

helpers.constant(ASJS.Color, "abgrHexToColor", function(hex, dst) {
  var result = ASJS.Color.valuesFromHex(hex);
  while (result.length < 4) result.unshift(0);
  return ASJS.Color.set(
    parseInt(result[3], 16),
    parseInt(result[2], 16),
    parseInt(result[1], 16),
    parseInt(result[0], 16) / 255,
    dst
  );
});

helpers.constant(ASJS.Color, "colorToRgbHex", function(color) {
  return ASJS.Color.intToHex(color.r) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.b);
});

helpers.constant(ASJS.Color, "colorToRgbaHex", function(color) {
  return ASJS.Color.intToHex(color.r) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.b) +
         ASJS.Color.intToHex(color.a * 255);
});

helpers.constant(ASJS.Color, "colorToArgbHex", function(color) {
  return ASJS.Color.intToHex(color.a * 255) +
         ASJS.Color.intToHex(color.r) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.b);
});

helpers.constant(ASJS.Color, "colorToAbgrHex", function(color) {
  return ASJS.Color.intToHex(color.a * 255) +
         ASJS.Color.intToHex(color.b) +
         ASJS.Color.intToHex(color.g) +
         ASJS.Color.intToHex(color.r);
});

helpers.constant(ASJS.Color, "rgbIntToColor", function(int, dst) {
  return ASJS.Color.rgbHexToColor(int.toString(16), dst);
});

helpers.constant(ASJS.Color, "rgbaIntToColor", function(int, dst) {
  return ASJS.Color.rgbaHexToColor(int.toString(16), dst);
});

helpers.constant(ASJS.Color, "argbIntToColor", function(int, dst) {
  return ASJS.Color.argbHexToColor(int.toString(16), dst);
});

helpers.constant(ASJS.Color, "abgrIntToColor", function(int, dst) {
  return ASJS.Color.abgrHexToColor(int.toString(16), dst);
});

helpers.constant(ASJS.Color, "colorToRgbInt", function(color) {
  return parseInt(ASJS.Color.colorToRgbHex(color), 16);
});

helpers.constant(ASJS.Color, "colorToRgbaInt", function(color) {
  return parseInt(ASJS.Color.colorToRgbaHex(color), 16);
});

helpers.constant(ASJS.Color, "colorToArgbInt", function(color) {
  return parseInt(ASJS.Color.colorToArgbHex(color), 16);
});

helpers.constant(ASJS.Color, "colorToAbgrInt", function(color) {
  return parseInt(ASJS.Color.colorToAbgrHex(color), 16);
});

helpers.constant(ASJS.Color, "clone", function(color) {
  return ASJS.Color.create(color.r, color.g, color.b, color.a);
});

helpers.constant(ASJS.Color, "cloneFloat", function(color) {
  return ASJS.Color.createFloat(color[0], color[1], color[2], color[3]);
});
