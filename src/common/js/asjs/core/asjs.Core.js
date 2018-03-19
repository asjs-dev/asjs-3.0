"use strict";

var stage;
var ASJS = (function() {
  var _scope = {};

  var _sourcePath     = "";
  var _includedScript = {};

  _scope.sourcePath = function(v) {
    _sourcePath = v;
  }

  _scope.import = function(f) {
    if (_includedScript[f]) return;
    _includedScript[f] = 1;
    var script = new ASJS.Tag("script");
        script.setAttr("type", "text/javascript");
        script.setAttr("src",  _sourcePath + f);
    ASJS.Head.addChild(script);
  }

  _scope.start = function(b) {
    ASJS.Polyfill.instance;
    if (!stage) {
      stage = ASJS.Stage.instance;
      stage.clear();
    }
    trace("<AS/JS> core version: 3.0.1.{{version}}");
    try {
      stage.addChild(new b());
    } catch (e) {
      trace(e);
    }
    return b;
  }

  return _scope;
})();

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

var property = function(t, n, v) {
  v.enumerable   = true;
  v.configurable = true;
  Object.defineProperty(t, n, v);
}
var prop = property;

var get = function(t, n, v) {
  prop(t, n, {get: v});
};

var g = get;

var set = function(t, n, v) {
  prop(t, n, {set: v});
};

var s = set;

var constant = function(t, n, v) {
  prop(t, n, {value: v});
}
var cnst = constant;

var message = function(t, n, v) {
  cnst(t, n, v + "_" + Date.now() + message.id++);
};
message.id = 0;
var msg = message;

var readOnlyFunction = cnst;
var rof = readOnlyFunction;

var extendProperties = function(t) {
  var s = {};
  for (var k in t) {
    if (["$n", "constructor"].indexOf(k) === -1) {
      var desc = Object.getOwnPropertyDescriptor(t, k);
      if (!desc) continue;
      if (desc.writable) s[k] = t[k];
      else prop(s, k, desc);
    }
  }
  return s;
};
var extProps = extendProperties;

var deleteProperty = function(t, p) {
  t[p] = null;
  delete t[p];
}
var del = deleteProperty;

var is = function(a, b) {
  return a instanceof b;
}

var tis = function(a, b) {
  return typeof a === b;
}

var empty = function(a) {
  try {
    return a === undefined || a === null;
  } catch(e) {
    return true;
  }
}

var createClass = function(name, base, body) {
  function setup(name, base, body, args) {
    if (!this.$n) this.$n = [];
    this.$n.push(name);
    base.apply(this, args);
    var s = extProps(this);
    if (body) body.apply(this, [this, s]);
    if (this.$n[0] === name) {
      del(this, "$n");
      if (this.new) {
        this.new.apply(this, args);
        del(this, "new");
      }
      del(this, "protected");
      del(this, "prot");
    }
  }

  return Function("var a=arguments;var name=a[0];var base=a[1];var body=a[2];var setup=a[3];var "+name+"=function(){setup.apply(this,[name,base,body,arguments]);};"+name+".prototype=Object.create(base.prototype);"+name+".prototype.constructor="+name+";return "+name+";")(name, base, body, setup);
}
var c0 = createClass;

var createSingletonClass = function(name, base, body) {
  var c = c0(name, base, body);
  get(c, "instance", function() {
    cnst(c, "instance", new c());
    return c.instance;
  });
  return c;
}
var c1 = createSingletonClass;

ASJS.BaseClass = c0(
"BaseClass",
Object,
function(_scope, _super) {
  _scope.new = function() {};
  _scope.prot = _scope.protected = {};
});
