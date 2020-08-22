var padStart = function(v, l) {
  return String(v / Math.pow(10, !emp(l) ? l : 2)).substr(2);
}
var ps = padStart;

var between = function(a, b, c) {
  return Math.max(a, Math.min(b, c));
}
var bw = between;

var isBetween = function(value, from, to) {
  return bw(from, to, value) === value;
}
var isBW = isBetween;

var isGreaterThan = function(value, from) {
  return value > from;
}
var isGT = isGreaterThan;

var isLowerThan = function(value, to) {
  return value < to;
}
var isLT = isLowerThan;
