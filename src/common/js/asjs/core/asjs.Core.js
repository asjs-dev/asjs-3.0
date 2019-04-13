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
    isDocumentComplete()
    ? start(b)
    : document.addEventListener(ASJS.DocumentEvent.READY_STATE_CHANGE, function() {
      isDocumentComplete() && start(b);
    });
  }

  function isDocumentComplete() {
    return document.readyState === "complete";
  }

  function start(b) {
    if (!stage) {
      stage = ASJS.Stage.instance;
      stage.clear();
    }
    trc("<AS/JS> core version: {{appVersion}}.{{date}}");
    try {
      var app = new b();
      is(app, ASJS.Tag) && stage.addChild(app);
    } catch (e) {
      trc(e);
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

var message = function(t, n) {
  if (!emp(t.name)) cnst(t, n, t.name + "_" + n);
  else cnst(t, n, n + "_" + Date.now() + message.id++);
};
message.id = 0;
var msg = message;

var readOnlyFunction = cnst;
var rof = readOnlyFunction;

var animationFrameFunction = function(callback) {
  return function() {
    var args = arguments;
    requestAnimationFrame(function() {
      callback.apply(this, args);
    });
  }
}
var aff = animationFrameFunction;

var map = function(o, cb) {
  for (var k in o) {
    if (!o.hasOwnProperty(k)) continue;
    var v = cb(k, o[k]);
    if (!emp(v)) o[k] = v;
  }
}

var iterateOver = function(o, cb, ccb) {
  if (emp(o)) return en();
  var ks = Object.keys(o);
  var k;
  var i = -1;
  function en() {
    ccb && ccb();
  }
  function n() {
    i++;
    if (i === ks.length) {
      en();
      return;
    }
    k = ks[i];
    if (!o.hasOwnProperty(k)) n();
    var iv;
    try {
      iv = o[k];
    } catch (e) {}
    var v = cb(k, iv, n, en);
    if (!emp(v)) o[k] = v;
  }
  n();
}
var ito = iterateOver;

var between = function(a, b, c) {
  return Math.max(a, Math.min(b, c));
}
var bw = between;

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

var destructObject = function(t) {
  ito(t, function(key, item, next) {
    if (tis(item, "object")) destObj(item);
    destCls(item);
    del(t, key);
    next();
  });
  t = null;
};
var destObj = destructObject;

var destructClass = function(t) {
  t && t.destruct && t.destruct();
}
var destCls = destructClass;

var emptyFunction = function() {}
var ef = emptyFunction;

var deleteProperty = function(t, p) {
  var desc = Object.getOwnPropertyDescriptor(t, p);
  if (desc && (desc.get || desc.set)) prop(t, p, {set: ef, get: ef});
  else t[p] = null;
  delete t[p];
}
var del = deleteProperty;

var is = function(a, b) {
  return a instanceof b;
}

var tis = function(a, b) {
  return b === "number"
    ? parseFloat(a) == a
    : typeof a === b;
}

var empty = function(a) {
  try {
    return a === undefined || a === null || a === "" || a.length === 0;
  } catch(e) {
    return true;
  }
}
var emp = empty;

var padStart = function(v, l) {
  return String(v / Math.pow(10, !emp(l) ? l : 2)).substr(2);
}
var ps = padStart;

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
    c.instance.destruct = null;
    return c.instance;
  });
  return c;
}
var c1 = createSingletonClass;

var createNamedObject = function(name, parent) {
  var t = extProps(parent);
      t.name = name;
  return t;
}
var c2 = createNamedObject;

ASJS.BaseClass = c0(
"BaseClass",
Object,
function(_scope, _super) {
  _scope.new = function() {};
  _scope.protected = {};
  _scope.prot = _scope.protected;
  _scope.destruct = function() {
    destObj(_scope);
    destObj(_super);
  }
});
