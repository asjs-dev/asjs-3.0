ASJS.Color = createClass(
"Color",
ASJS.BaseClass,
function(_scope) {
  _scope.new = function(r, g, b, a) {
    _scope.r = r || 0;
    _scope.g = g || 0;
    _scope.b = b || 0;
    _scope.a = empty(a) ? 1 : a;
  }

  prop(_scope, "hex", {
    get: function() { return ASJS.Color.rgbToHex(_scope); },
    set: function(v) {
    var color = ASJS.Color.hexToRgb(v);
    _scope.r = color.r;
    _scope.g = color.g;
    _scope.b = color.b;
    _scope.a = color.a;
    }
  });
});

rof(ASJS.Color, "twoColorDistance", function(c1, c2) {
  var d =
    Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) +
    Math.abs(c1.b - c2.b) + Math.abs(c1.a - c2.a);
  return d;
});

rof(ASJS.Color, "rgbToString", function(color) {
  return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
});

rof(ASJS.Color, "hexToRgb", function(hex) {
  var shorthandRegex = /^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? new ASJS.Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 255) : null;
});

rof(ASJS.Color, "rgbToHex", function(color) {
  var toHex = function(v) {
    var hex = v.toString(16);
    return (hex.length == 1 ? "0" : "") + hex;
  }
  return toHex(color.r) + toHex(color.g) + toHex(color.b);
});

rof(ASJS.Color, "intToColor", function(num) {
  num >>>= 0;
  var b = num & 0xFF,
      g = (num & 0xFF00) >>> 8,
      r = (num & 0xFF0000) >>> 16,
      a = ((num & 0xFF000000) >>> 24) / 255 ;
  return new ASJS.Color(r, g, b, a);
});
