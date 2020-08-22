require("./property.js");
require("./extendProperties.js");

var override = function(t, s, k) {
  if (["$n", "constructor"].indexOf(k) === -1) {
    var desc = Object.getOwnPropertyDescriptor(t, k);
    if (desc.writable) s[k] = t[k];
    else prop(s, k, desc);
  }
};
var ovrd = override;

var destructClass = function(t) {
  t && t.destruct && t.destruct();
}
var destCls = destructClass;

var createClass = function(nameSpace, name, base, body, singleton) {
  function setup(name, base, body, args) {
    base.apply(this, args);
    var s = {};
    s.protected = s.prot = this.protected;
    body && body.apply(this, [this, s]);

    if (this.constructor.name === name) {
      if (this.new) {
        this.new.apply(this, args);
        del(this, "new");
      }
      del(this, "protected");
      del(this, "prot");
    }
  }

  var x = Function(
    "var a=arguments;" +
    "return function "+name+"(){" +
      "a[3].apply(this,[a[0],a[1],a[2],arguments]);" +
    "};"
  )(name, base, body, setup);
  x.prototype = Object.create(base.prototype);
  x.prototype.constructor = x;

  var proto = x;
  if (singleton) {
    var y = {};
    get(y, "instance", function() {
      if (!x.instance) {
        x.instance = new x();
        x.instance.destruct = function() {};
      }
      return x.instance;
    });
    proto = y;
  }
  cnst(nameSpace, name, proto);
}
var c0 = createClass;

var createSingletonClass = function(nameSpace, name, base, body) {
  c0(nameSpace, name, base, body, true);
}
var c1 = createSingletonClass;

var createNamedObject = function(name, parent) {
  var t = extProps(parent);
      t.name = name;
  return t;
}
var c2 = createNamedObject;

var createUtility = function(nameSpace, name) {
  cnst(nameSpace, name, {});
}
var c3 = createUtility;
