createUtility(ASJS, "Color");
rof(ASJS.Color, "create", function(r, g, b, a) {
  return ASJS.Color.set(r, g, b, a);
});

rof(ASJS.Color, "createFloat", function(r, g, b, a) {
  return ASJS.Color.setFloat(r, g, b, a);
});

rof(ASJS.Color, "set", function(r, g, b, a, dst) {
  dst = dst || {};
  dst.r = valueOrDefault(r, 0);
  dst.g = valueOrDefault(g, 0);
  dst.b = valueOrDefault(b, 0);
  dst.a = valueOrDefault(a, 1);
  return dst;
});

rof(ASJS.Color, "setFloat", function(r, g, b, a, dst) {
  dst = dst || new Float32Array(4);
  dst[0] = valueOrDefault(r, 0);
  dst[1] = valueOrDefault(g, 0);
  dst[2] = valueOrDefault(b, 0);
  dst[3] = valueOrDefault(a, 1);
  return dst;
});

rof(ASJS.Color, "multiply", function(a, b, dst) {
  return ASJS.Color.set(
    (a.r * b.r) / 255,
    (a.g * b.g) / 255,
    (a.b * b.b) / 255,
    a.a * b.a,
    dst
  );
});

rof(ASJS.Color, "toFloat", function(v, dst) {
  return ASJS.Color.setFloat(
    v.r / 255,
    v.g / 255,
    v.b / 255,
    v.a,
    dst
  );
});

rof(ASJS.Color, "fromFloat", function(v, dst) {
  return ASJS.Color.set(
    Math.floor(v[0] * 255),
    Math.floor(v[1] * 255),
    Math.floor(v[2] * 255),
    v[3],
    dst
  );
});

rof(ASJS.Color, "parse", function(v, dst) {
  if (tis(v, "number") || parseFloat(v) == v) return ASJS.Color.rgbIntToColor(v, dst);
  if (tis(v, "string")) {
    if (v.length > 7) return ASJS.Color.rgbaHexToColor(v, dst);
    return ASJS.Color.rgbHexToColor(v, dst);
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

rof(ASJS.Color, "rgbHexToColor", function(hex, dst) {
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

rof(ASJS.Color, "rgbaHexToColor", function(hex, dst) {
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

rof(ASJS.Color, "argbHexToColor", function(hex, dst) {
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

rof(ASJS.Color, "abgrHexToColor", function(hex, dst) {
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

rof(ASJS.Color, "rgbIntToColor", function(int, dst) {
  return ASJS.Color.rgbHexToColor(int.toString(16), dst);
});

rof(ASJS.Color, "rgbaIntToColor", function(int, dst) {
  return ASJS.Color.rgbaHexToColor(int.toString(16), dst);
});

rof(ASJS.Color, "argbIntToColor", function(int, dst) {
  return ASJS.Color.argbHexToColor(int.toString(16), dst);
});

rof(ASJS.Color, "abgrIntToColor", function(int, dst) {
  return ASJS.Color.abgrHexToColor(int.toString(16), dst);
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

rof(ASJS.Color, "cloneFloat", function(color) {
  return ASJS.Color.createFloat(color[0], color[1], color[2], color[3]);
});
