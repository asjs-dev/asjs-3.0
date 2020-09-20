var NameSpace = {};

[helpers.createClass|createSingletonClass]([this|NameSpace], "SampleClass", [helpers.BaseClass|parentClass], function(_scope[, _super]) {
  var priv = {};

  helpers.constant(priv, "PRIVATE_CONST", 0);

  _scope.publicVar = 0;

  _super.protected.protectedVar = 0;

  var _privateVar;

  helpers.override(_scope, _super, "new");
  _scope.new = function() {
    console.log("new SampleClass()");
    _super.new("parentParam");
  }

  helpers.get(_scope, "val", function() { return _privateVar; });
  helpers.set(_scope, "val", function(v) { _privateVar = v; });

  helpers.get(priv, "val", function() { return _privateVar; });
  helpers.set(priv, "val", function(v) { _privateVar = v; });

  helpers.get(_super.protected, "val", function() { return _privateVar; });
  helpers.set(_super.protected, "val", function(v) { _privateVar = v; });

  helpers.property(_scope, "val", {
    get: function() { return _privateVar; },
    set: function(v) { _privateVar = v; }
  });

  helpers.property(_super.protected, "val", {
    get: function() { return _privateVar; },
    set: function(v) { _privateVar = v; }
  });

  helpers.property(priv, "val", {
    get: function() { return _privateVar; },
    set: function(v) { _privateVar = v; }
  });

  helpers.constant(_scope, "publicFunction", function() {});
  _scope.publicFunction = function() {};

  helpers.constant(_super.protected, "protectedFunction", function() {});
  _super.protected.protectedFunction = function() {};

  helpers.property(priv, "privateFunction", function() {});

  function privateFunction() {};

  helpers.createClass(priv, "InternalClass", [helpers.BaseClass|parentClass], function(_scope, _super) {
    ...
  });
});
helpers.constant(NameSpace.SampleClass, "PUBLIC_STATIC_CONST", 10);
helpers.message(NameSpace.SampleClass, "PUBLIC_STATIC_CONST");
NameSpace.SampleClass.publicStaticVar = 0;
helpers.property(NameSpace.SampleClass, "val", {
  get: function() { return NameSpace.SampleClass.publicStaticVar; },
  set: function(v) { NameSpace.SampleClass.publicStaticVar = v; }
});
helpers.constant(NameSpace.SampleClass, "publicStaticFunction", function(param) {});
