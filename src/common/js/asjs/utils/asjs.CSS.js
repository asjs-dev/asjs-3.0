require("../display/asjs.Head.js");
require("../core/asjs.Polyfill.js");
require("../utils/asjs.CSS.js");

createSingletonClass(ASJS, "CSS", BaseClass, function(_scope) {
  var _head = ASJS.Head.instance;

  var priv = {};

  var _runTimeStyle;
  var _merged;

  _scope.new = updateMergedList;

  get(_scope, "styles", function() { return _merged; });

  _scope.getRuleBySelector = function(s) {
    var i = _merged.length;
    while (i--) {
      var rule = _merged[i].rule;
      if (rule.selectorText === s) return rule;
    }
    return null;
  }

  _scope.getRuleExists = function(s) {
    return !empty(_scope.getRuleBySelector(s));
  }

  _scope.getPropertyFromRule = function(s, t) {
    var r = _scope.getRuleBySelector(s);
    return !r ? null : r.style[t];
  }

  _scope.setPropertyToRule = function(s, t, v) {
    var r = _scope.getRuleBySelector(s);
    if (!r) return;
    r.style[t] = v;
    updateMergedList();
  }

  _scope.addRule = function(s, t) {
    if (_scope.getRuleBySelector(s)) return;
    createRunTimeStyle();
    _runTimeStyle.el.sheet.insertRule(s + "{" + ( t || "" ) + "}", 0);
    updateMergedList();
  }

  _scope.removeRule = function(s) {
    var styles = getSheets();
    var i = -1;
    var rule;
    while (rule = _merged[++i]) {
      if (rule.rule.selectorText === s) {
        styles[rule.id].deleteRule(rule.ruleId);
        updateMergedList();
        return;
      }
    }
  }

  function updateMergedList() {
    var styles = getSheets();
    var i = -1;
    _merged = [];
    while (++i < styles.length) {
      var style = styles[i].cssRules;
      var j = -1;
      while (++j < style.length) _merged.push(new priv.Rule(i, j, style[j]));
    }
  }

  function getSheets() {
    return document.styleSheets;
  }

  function hasRunTimeStyle () {
    return _runTimeStyle;
  }

  function createRunTimeStyle() {
    if (hasRunTimeStyle()) return;
    _runTimeStyle = new ASJS.Tag("style");
    _runTimeStyle.setAttr("type", "text/css");
    _head.addChild(_runTimeStyle);
  }

  createClass(priv, "Rule", BaseClass, function(_scope) {
    _scope.sheetId;
    _scope.ruleId;
    _scope.rule;

    _scope.new = function(sheetId, ruleId, rule) {
      _scope.sheetId = sheetId;
      _scope.ruleId  = ruleId;
      _scope.rule    = rule;
    }
  });
});

cnst(ASJS.CSS, "ADD_PIXEL_TYPES", [
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "top",
  "bottom",
  "left",
  "right",
  "margin",
  "margin-top",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "padding",
  "padding-top",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "font-size",
  "border-size"
]);

cnst(ASJS.CSS, "SELECTOR", ['fullscreen', 'placeholder']);

cnst(ASJS.CSS, "VALUE", [
  'gradient',
  'intrinsic',
  'pixelated',
  'image-set',
  'cross-fade',
  'flex-values',
  'display-flex',
  'display-grid',
  'filter-value'
]);

rof(ASJS.CSS, "replaceHyphen", function(s) {
  return s.replace(/-./g, function(v) {
    return v.replace("-", "").toUpperCase();
  });
});

rof(ASJS.CSS, "convertProperty", function(k) {
  var nk = ASJS.Polyfill.stylePrefixCSS + k;
  var i = -1;
  var l = ASJS.CSS.SELECTOR.length;
  while (++i < l) {
    if (nk.indexOf(":" + ASJS.CSS.SELECTOR[i]) > -1) {
      nk = nk.replace(":" + ASJS.CSS.SELECTOR[i], ":" + ASJS.Polyfill.stylePrefixCSS + ASJS.CSS.SELECTOR[i]);
      i = l;
      break;
    }
  }

  return nk;
});

rof(ASJS.CSS, "convertValue", function(v) {
  var i = -1;
  var l = ASJS.CSS.VALUE.length;
  while (++i < l) {
    if (String(v).indexOf(ASJS.CSS.VALUE[i]) > -1) return ASJS.Polyfill.stylePrefixCSS + v;
  }
  return v;
});

rof(ASJS.CSS, "setCSS", function(t, k, v) {
  v = tis(v, "number") && ASJS.CSS.ADD_PIXEL_TYPES.has(k) ? v + "px" : v;
  var nk = ASJS.CSS.convertProperty(k);
  var nv = ASJS.CSS.convertValue(v);
  t.el.style[ASJS.CSS.replaceHyphen(k)] = v;
  t.el.style[ASJS.CSS.replaceHyphen(nk)] = nv;
});

rof(ASJS.CSS, "getCSS", function(t, k) {
  var v = t.el.style[ASJS.CSS.replaceHyphen(k)];
  if (!v) {
    var style = window.getComputedStyle(t.el);
    v = style.getPropertyValue(k);
  }
  return (
    ASJS.CSS.ADD_PIXEL_TYPES.has(k) &&
    (tis(v, "number") || v.indexOf("px") > -1)
      ? parseFloat(v)
      : v
  ) || 0;
});

rof(ASJS.CSS, "removeCSS", function(t, k) {
  t.el.style[ASJS.CSS.replaceHyphen(k)] = "";
});
