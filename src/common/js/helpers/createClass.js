require("./NameSpace.js");
require("./property.js");
require("./constant.js");
require("./extendProperties.js");

helpers.override = function(t, s, k) {
  if (["$n", "constructor"].indexOf(k) === -1) {
    var desc = Object.getOwnPropertyDescriptor(t, k);
    if (desc.writable) s[k] = t[k];
    else helpers.property(s, k, desc);
  }
};

helpers.destructClass = function(t) {
  t && t.destruct && t.destruct();
}

helpers.createClass = function(nameSpace, name, base, body, singleton) {
  function setup(name, base, body, args) {
    base.apply(this, args);
    var s = {};
    s.protected = s.prot = this.protected;
    body && body.apply(this, [this, s]);

    if (this.constructor.name === name) {
      if (this.new) {
        this.new.apply(this, args);
        helpers.deleteProperty(this, "new");
      }
      helpers.deleteProperty(this, "protected");
      helpers.deleteProperty(this, "prot");
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
    helpers.get(y, "instance", function() {
      if (!x.instance) {
        x.instance = new x();
        x.instance.destruct = function() {};
      }
      return x.instance;
    });
    proto = y;
  }
  helpers.constant(nameSpace, name, proto);
}

helpers.createSingletonClass = function(nameSpace, name, base, body) {
  helpers.createClass(nameSpace, name, base, body, true);
}
