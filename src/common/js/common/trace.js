var trace = console.log;
var trc = trace;
try {
  trace("");
} catch (e) {
  console.log(e);
  trace = function() {};
}
trc = trace;
console.clear();
