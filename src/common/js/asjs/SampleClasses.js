var SampleClass = createClass(
var SampleClass = createSingletonClass(
"SampleClass",
[ASJS.BaseClass | parentClass],
function(_scope[, _super]) {
  var priv = {};

  cnst(priv, "PRIVATE_CONST", 0);

  _scope.publicVar = 0;

  _super.protected.protectedVar = 0;

  var _privateVar;

  _scope.new = function() {
    trace("new SampleClass()");
    _super.new("parentParam");
  }

  get(_scope, "val", function() { return _privateVar; });
  set(_scope, "val", function(v) { _privateVar = v; });

  get(priv, "val", function() { return _privateVar; });
  set(priv, "val", function(v) { _privateVar = v; });

  get(_super.protected, "val", function() { return _privateVar; });
  set(_super.protected, "val", function(v) { _privateVar = v; });

  prop(_scope, "val", {
    get: function() { return _privateVar; },
    set: function(v) { _privateVar = v; }
  });

  prop(_super.protected, "val", {
    get: function() { return _privateVar; },
    set: function(v) { _privateVar = v; }
  });

  prop(priv, "val", {
    get: function() { return _privateVar; },
    set: function(v) { _privateVar = v; }
  });

  rof(_scope, "publicFunction", function() {});
  _scope.publicFunction = function() {};

  rof(_super.protected, "protectedFunction", function() {});
  _super.protected.protectedFunction = function() {};

  prop(priv, "privateFunction", function() {});

  function privateFunction() {};

  var InternalClass = createClass(
  "InternalClass",
  [ASJS.BaseClass | parentClass],
  function(_scope, _super) {
    ...
  });
});
cnst(SampleClass, "PUBLIC_STATIC_CONST", 10);
msg(SampleClass, "PUBLIC_STATIC_CONST");
SampleClass.publicStaticVar = 0;
prop(SampleClass, "val", {
  get: function() { return SampleClass.publicStaticVar; },
  set: function(v) { SampleClass.publicStaticVar = v; }
});
rof(SampleClass, "publicStaticFunction", function(param) {});
