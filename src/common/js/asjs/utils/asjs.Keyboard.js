require("../event/asjs.KeyboardEvent.js");
require("../event/asjs.FocusEvent.js");
require("../display/asjs.Window.js");

helpers.createClass(ASJS, "Keyboard", helpers.BaseClass, function(_scope, _super) {
  var _window = ASJS.Window.instance;

  var _pressedKeys = {};
  var _targets     = [];

  var _downCallback;
  var _upCallback;

  _scope.isAnyPressed = function() {
    var any = false;

    helpers.map(_pressedKeys, function(key, item) {
      item && (any = true);
    });

    return any;
  };

  _scope.isPressed = function(w) {
    return _pressedKeys[w];
  };

  _scope.addKeyListener = function(target, downCallback, upCallback) {
    if (!target || helpers.inArray(_targets, target)) return;
    _targets.push(target);

    _downCallback = downCallback;
    _upCallback   = upCallback;

    _scope.removeKeyListener(target);

    target.addEventListener(ASJS.KeyboardEvent.KEY_DOWN, onKeyDown);
    target.addEventListener(ASJS.KeyboardEvent.KEY_UP,   onKeyUp);

    _window.addEventListener(ASJS.FocusEvent.BLUR, onBlur);
  };

  _scope.removeKeyListener = function(target) {
    if (!helpers.inArray(_targets, target)) return;
    helpers.removeFromArray(_targets, target);

    target.removeEventListener(ASJS.KeyboardEvent.KEY_DOWN, onKeyDown);
    target.removeEventListener(ASJS.KeyboardEvent.KEY_UP,   onKeyUp);

    _window.removeEventListener(ASJS.FocusEvent.BLUR, onBlur);
  };

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    while (_targets.length > 0) _scope.removeKeyListener(_targets.shift());

    _pressedKeys  =
    _downCallback =
    _upCallback   =
    _targets      = null;

    _super.destruct();
  }

  function onBlur() {
    helpers.map(_pressedKeys, function() {
      return false;
    });
  };

  function onKeyDown(e) {
    _pressedKeys[e.which] = true;
    _downCallback && _downCallback();
  };

  function onKeyUp(e) {
    _pressedKeys[e.which] = false;
    _upCallback && _upCallback();
  };
});
helpers.constant(ASJS.Keyboard, "SPACE",            32);
helpers.constant(ASJS.Keyboard, "BACKSPACE",        8);
helpers.constant(ASJS.Keyboard, "TAB",              9);
helpers.constant(ASJS.Keyboard, "ENTER",            13);
helpers.constant(ASJS.Keyboard, "SHIFT",            16);
helpers.constant(ASJS.Keyboard, "CTRL",             17);
helpers.constant(ASJS.Keyboard, "ALT",              18);
helpers.constant(ASJS.Keyboard, "PAUSE_BREAK",      19);
helpers.constant(ASJS.Keyboard, "CAPS_LOCK",        20);
helpers.constant(ASJS.Keyboard, "ESCAPE",           27);
helpers.constant(ASJS.Keyboard, "PAGE_UP",          33);
helpers.constant(ASJS.Keyboard, "PAGE_DOWN",        34);
helpers.constant(ASJS.Keyboard, "END",              35);
helpers.constant(ASJS.Keyboard, "HOME",             36);
helpers.constant(ASJS.Keyboard, "LEFT_ARROW",       37);
helpers.constant(ASJS.Keyboard, "UP_ARROW",         38);
helpers.constant(ASJS.Keyboard, "RIGHT_ARROW",      39);
helpers.constant(ASJS.Keyboard, "DOWN_ARROW",       40);
helpers.constant(ASJS.Keyboard, "INSERT",           45);
helpers.constant(ASJS.Keyboard, "DELETE",           46);
helpers.constant(ASJS.Keyboard, "NUM_0",            48);
helpers.constant(ASJS.Keyboard, "NUM_1",            49);
helpers.constant(ASJS.Keyboard, "NUM_2",            50);
helpers.constant(ASJS.Keyboard, "NUM_3",            51);
helpers.constant(ASJS.Keyboard, "NUM_4",            52);
helpers.constant(ASJS.Keyboard, "NUM_5",            53);
helpers.constant(ASJS.Keyboard, "NUM_6",            54);
helpers.constant(ASJS.Keyboard, "NUM_7",            55);
helpers.constant(ASJS.Keyboard, "NUM_8",            56);
helpers.constant(ASJS.Keyboard, "NUM_9",            57);
helpers.constant(ASJS.Keyboard, "A",                65);
helpers.constant(ASJS.Keyboard, "B",                66);
helpers.constant(ASJS.Keyboard, "C",                67);
helpers.constant(ASJS.Keyboard, "D",                68);
helpers.constant(ASJS.Keyboard, "E",                69);
helpers.constant(ASJS.Keyboard, "F",                70);
helpers.constant(ASJS.Keyboard, "G",                71);
helpers.constant(ASJS.Keyboard, "H",                72);
helpers.constant(ASJS.Keyboard, "I",                73);
helpers.constant(ASJS.Keyboard, "J",                74);
helpers.constant(ASJS.Keyboard, "K",                75);
helpers.constant(ASJS.Keyboard, "L",                76);
helpers.constant(ASJS.Keyboard, "M",                77);
helpers.constant(ASJS.Keyboard, "N",                78);
helpers.constant(ASJS.Keyboard, "O",                79);
helpers.constant(ASJS.Keyboard, "P",                80);
helpers.constant(ASJS.Keyboard, "Q",                81);
helpers.constant(ASJS.Keyboard, "R",                82);
helpers.constant(ASJS.Keyboard, "S",                83);
helpers.constant(ASJS.Keyboard, "T",                84);
helpers.constant(ASJS.Keyboard, "U",                85);
helpers.constant(ASJS.Keyboard, "V",                86);
helpers.constant(ASJS.Keyboard, "W",                87);
helpers.constant(ASJS.Keyboard, "X",                88);
helpers.constant(ASJS.Keyboard, "Y",                89);
helpers.constant(ASJS.Keyboard, "Z",                90);
helpers.constant(ASJS.Keyboard, "LEFT_WINDOW_KEY",  91);
helpers.constant(ASJS.Keyboard, "RIGHT_WINDOW_KEY", 92);
helpers.constant(ASJS.Keyboard, "SELECT_KEY",       93);
helpers.constant(ASJS.Keyboard, "NUMPAD_0",         96);
helpers.constant(ASJS.Keyboard, "NUMPAD_1",         97);
helpers.constant(ASJS.Keyboard, "NUMPAD_2",         98);
helpers.constant(ASJS.Keyboard, "NUMPAD_3",         99);
helpers.constant(ASJS.Keyboard, "NUMPAD_4",         100);
helpers.constant(ASJS.Keyboard, "NUMPAD_5",         101);
helpers.constant(ASJS.Keyboard, "NUMPAD_6",         102);
helpers.constant(ASJS.Keyboard, "NUMPAD_7",         103);
helpers.constant(ASJS.Keyboard, "NUMPAD_8",         104);
helpers.constant(ASJS.Keyboard, "NUMPAD_9",         105);
helpers.constant(ASJS.Keyboard, "MULTIPLY",         106);
helpers.constant(ASJS.Keyboard, "ADD",              107);
helpers.constant(ASJS.Keyboard, "SUBTRACT",         109);
helpers.constant(ASJS.Keyboard, "DECIMAL_POINT",    110);
helpers.constant(ASJS.Keyboard, "DIVIDE",           111);
helpers.constant(ASJS.Keyboard, "F1",               112);
helpers.constant(ASJS.Keyboard, "F2",               113);
helpers.constant(ASJS.Keyboard, "F3",               114);
helpers.constant(ASJS.Keyboard, "F4",               115);
helpers.constant(ASJS.Keyboard, "F5",               116);
helpers.constant(ASJS.Keyboard, "F6",               117);
helpers.constant(ASJS.Keyboard, "F7",               118);
helpers.constant(ASJS.Keyboard, "F8",               119);
helpers.constant(ASJS.Keyboard, "F9",               120);
helpers.constant(ASJS.Keyboard, "F10",              121);
helpers.constant(ASJS.Keyboard, "F11",              122);
helpers.constant(ASJS.Keyboard, "F12",              123);
helpers.constant(ASJS.Keyboard, "NUM_LOCK",         144);
helpers.constant(ASJS.Keyboard, "SCROLL_LOCK",      145);
helpers.constant(ASJS.Keyboard, "SEMICOLON",        186);
helpers.constant(ASJS.Keyboard, "EQUAL_SIGN",       187);
helpers.constant(ASJS.Keyboard, "COMMA",            188);
helpers.constant(ASJS.Keyboard, "DASH",             189);
helpers.constant(ASJS.Keyboard, "PERIOD",           190);
helpers.constant(ASJS.Keyboard, "FORWARD_SLASH",    191);
helpers.constant(ASJS.Keyboard, "GRAVE_ACCENT",     192);
helpers.constant(ASJS.Keyboard, "OPEN_BRACKET",     219);
helpers.constant(ASJS.Keyboard, "BACK_SLASH",       220);
helpers.constant(ASJS.Keyboard, "CLOSE_BRAKET",     221);
helpers.constant(ASJS.Keyboard, "SINGLE_QUOTE",     222);
