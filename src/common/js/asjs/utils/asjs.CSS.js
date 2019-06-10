require("../display/asjs.Head.js");
require("../core/asjs.Polyfill.js");
require("../utils/asjs.CSS.js");

createSingletonClass(ASJS, "CSS", ASJS.BaseClass, function(_scope) {
  var _head = ASJS.Head.instance;

  var _runTimeStyle;
  var _merged;

  _scope.new = function() {
    updateMergedList();
  }

  get(_scope, "styles", function() { return _merged; });

  _scope.getRuleBySelector = function(s) {
    var i = -1;
    var l = _merged.length;
    while (++i < l) {
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
    if (r) {
      r.style[t] = v;
      updateMergedList();
    }
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
        styles[rule.sheetId].deleteRule(rule.ruleId);
        updateMergedList();
        return;
      }
    }
  }

  function updateMergedList() {
    var styles = getSheets();
    var i = -1;
    var l = styles.length;
    _merged = [];
    while (++i < l) {
      var style = styles[i].cssRules;
      var j = -1;
      var m = style.length;
      while (++j < m) _merged.push(new Rule(i, j, style[j]));
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

  createClass(this, "Rule", ASJS.BaseClass, function(_super) {
    _scope.sheetId;
    _scope.ruleId;
    _scope.rule;

    _scope.new = function(sheetId, ruleId, rule) {
      _scope.sheetId = sheetId;
      _scope.ruleId = ruleId;
      _scope.rule = rule;
    }
  });
});

cnst(ASJS.CSS, "ADD_PIXEL_TYPES", [
  "width",
  "height",
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
  var nk = ASJS.Polyfill.instance.stylePrefixCSS + k;
  var i = -1;
  var l = ASJS.CSS.SELECTOR.length;
  while (++i < l) {
    if (nk.indexOf(":" + ASJS.CSS.SELECTOR[i]) > -1) {
      nk = nk.replace(":" + ASJS.CSS.SELECTOR[i], ":" + ASJS.Polyfill.instance.stylePrefixCSS + ASJS.CSS.SELECTOR[i]);
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
    if (String(v).indexOf(ASJS.CSS.VALUE[i]) > -1) return ASJS.Polyfill.instance.stylePrefixCSS + v;
  }
  return v;
});

rof(ASJS.CSS, "setCSS", function(t, k, v) {
  v = tis(v, "number") && ASJS.CSS.ADD_PIXEL_TYPES.indexOf(k) > -1 ? v + "px" : v;
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
    ASJS.CSS.ADD_PIXEL_TYPES.indexOf(k) > -1 &&
    (tis(v, "number") || v.indexOf("px") > -1)
      ? parseFloat(v)
      : v
  ) || 0;
});
