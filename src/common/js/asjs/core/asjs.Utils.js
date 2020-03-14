"use strict";

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

var _d = document;
var _w = window;
var _m = Math;

var isDocumentComplete = function() {
  return document.readyState === "complete";
}
var idc = isDocumentComplete;

var is = function(a, b) {
  return a instanceof b;
}

var tis = function(a, b) {
  return typeof a === b;
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

var between = function(a, b, c) {
  return Math.max(a, Math.min(b, c));
}
var bw = between;

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
  try {
    cnst(t, n, "e" + Date.now() + "" + message.id++);
  } catch (e) {
    trace("ERROR", n);
  }
};
message.id = 0;
var msg = message;

var readOnlyFunction = cnst;
var rof = readOnlyFunction;

var placeholderFunction = function() {};
var phf = placeholderFunction;

var animationFrameFunction = function(callback) {
  return function() {
    var args = arguments;
    requestAnimationFrame(function() {
      callback.apply(this, args);
    });
  }
}
var aff = animationFrameFunction;

var throttleFunction = function(callback) {
  var timeout;
  return function() {
    clearTimeout(timeout);
    var args = arguments;
    timeout = setTimeout(callback.bind(this, args), 1);
  }
}
var tf = throttleFunction;

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
    if (o.hasOwnProperty && !o.hasOwnProperty(k)) n();
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

var destructObject = function(t, stack) {
  var stack = stack || [];
  ito(t, function(key, item, next) {
    var isItemObject = tis(item, "object");
    if (!isItemObject || stack.indexOf(item) === -1) {
      stack.push(item);
      isItemObject && destObj(item, stack);
      destCls(item);
      del(t, key);
    }
    next();
  });
  stack =
  t     = null;
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
  else {
    try {
      t[p] = null;
    } catch (e) {};
  }
  delete t[p];
}
var del = deleteProperty;

var dataMapper = function(data, objectType) {
  var instance = new objectType();
  map(data, function(key) {
    instance[key] = data[key];
  });

  return instance;
}

var dm = dataMapper;

var createClass = function(nameSpace, name, base, body, singleton) {
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

  var x = Function("var a=arguments;var name=a[0];var base=a[1];var body=a[2];var setup=a[3];var "+name+"=function(){setup.apply(this,[name,base,body,arguments]);};"+name+".prototype=Object.create(base.prototype);"+name+".prototype.constructor="+name+";return "+name+";")(name, base, body, setup);
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

var resolvePath = function(basePath, path) {
  var basePathArray = basePath.split("/");
  emp(basePathArray[basePathArray.length - 1]) && basePathArray.pop();
  var pathArray = path.split("/");
  emp(pathArray[pathArray.length - 1]) && pathArray.pop();

  if ([".", ".."].indexOf(pathArray[0]) === -1) return path;

  var i = -1;
  var l = pathArray.length;
  while (++i < l) {
    if (pathArray[i] === "..") basePathArray.pop();
    else if (pathArray[i] !== ".") basePathArray.push(pathArray[i]);
  }

  return basePathArray.join("/");
}
