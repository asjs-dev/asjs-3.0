require("../event/asjs.KeyboardEvent.js");
require("../event/asjs.FocusEvent.js");
require("../display/asjs.Window.js");

createClass(ASJS, "Keyboard", ASJS.BaseClass, function(_scope, _super) {
  var _window = ASJS.Window.instance;

  var _pressedKeys = {};
  var _targets     = [];

  var _downCallback;
  var _upCallback;

  _scope.isPressed = function(w) {
    return _pressedKeys[w];
  };

  _scope.addKeyListener = function(target, downCallback, upCallback) {
    if (!target) return;
    if (_targets.has(target)) return;
    _targets.push(target);

    _downCallback = downCallback;
    _upCallback   = upCallback;

    _scope.removeKeyListener(target);

    target.addEventListener(ASJS.KeyboardEvent.KEY_DOWN, onKeyDown);
    target.addEventListener(ASJS.KeyboardEvent.KEY_UP,   onKeyUp);

    _window.addEventListener(ASJS.FocusEvent.BLUR, onBlur);
  };

  _scope.removeKeyListener = function(target) {
    if (!_targets.has(target)) return;
    _targets.remove(target);

    target.removeEventListener(ASJS.KeyboardEvent.KEY_DOWN, onKeyDown);
    target.removeEventListener(ASJS.KeyboardEvent.KEY_UP,   onKeyUp);

    _window.removeEventListener(ASJS.FocusEvent.BLUR, onBlur);
  };

  _scope.destruct = function() {
    while (_targets.length > 0) _scope.removeKeyListener(_targets.shift());

    _pressedKeys  = null;
    _downCallback = null;
    _upCallback   = null;
    _targets      = null;

    _super.destruct();
  }

  function onBlur() {
    map(_pressedKeys, function(k) {
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
cnst(ASJS.Keyboard, "SPACE",            32);
cnst(ASJS.Keyboard, "BACKSPACE",        8);
cnst(ASJS.Keyboard, "TAB",              9);
cnst(ASJS.Keyboard, "ENTER",            13);
cnst(ASJS.Keyboard, "SHIFT",            16);
cnst(ASJS.Keyboard, "CTRL",             17);
cnst(ASJS.Keyboard, "ALT",              18);
cnst(ASJS.Keyboard, "PAUSE_BREAK",      19);
cnst(ASJS.Keyboard, "CAPS_LOCK",        20);
cnst(ASJS.Keyboard, "ESCAPE",           27);
cnst(ASJS.Keyboard, "PAGE_UP",          33);
cnst(ASJS.Keyboard, "PAGE_DOWN",        34);
cnst(ASJS.Keyboard, "END",              35);
cnst(ASJS.Keyboard, "HOME",             36);
cnst(ASJS.Keyboard, "LEFT_ARROW",       37);
cnst(ASJS.Keyboard, "UP_ARROW",         38);
cnst(ASJS.Keyboard, "RIGHT_ARROW",      39);
cnst(ASJS.Keyboard, "DOWN_ARROW",       40);
cnst(ASJS.Keyboard, "INSERT",           45);
cnst(ASJS.Keyboard, "DELETE",           46);
cnst(ASJS.Keyboard, "NUM_0",            48);
cnst(ASJS.Keyboard, "NUM_1",            49);
cnst(ASJS.Keyboard, "NUM_2",            50);
cnst(ASJS.Keyboard, "NUM_3",            51);
cnst(ASJS.Keyboard, "NUM_4",            52);
cnst(ASJS.Keyboard, "NUM_5",            53);
cnst(ASJS.Keyboard, "NUM_6",            54);
cnst(ASJS.Keyboard, "NUM_7",            55);
cnst(ASJS.Keyboard, "NUM_8",            56);
cnst(ASJS.Keyboard, "NUM_9",            57);
cnst(ASJS.Keyboard, "A",                65);
cnst(ASJS.Keyboard, "B",                66);
cnst(ASJS.Keyboard, "C",                67);
cnst(ASJS.Keyboard, "D",                68);
cnst(ASJS.Keyboard, "E",                69);
cnst(ASJS.Keyboard, "F",                70);
cnst(ASJS.Keyboard, "G",                71);
cnst(ASJS.Keyboard, "H",                72);
cnst(ASJS.Keyboard, "I",                73);
cnst(ASJS.Keyboard, "J",                74);
cnst(ASJS.Keyboard, "K",                75);
cnst(ASJS.Keyboard, "L",                76);
cnst(ASJS.Keyboard, "M",                77);
cnst(ASJS.Keyboard, "N",                78);
cnst(ASJS.Keyboard, "O",                79);
cnst(ASJS.Keyboard, "P",                80);
cnst(ASJS.Keyboard, "Q",                81);
cnst(ASJS.Keyboard, "R",                82);
cnst(ASJS.Keyboard, "S",                83);
cnst(ASJS.Keyboard, "T",                84);
cnst(ASJS.Keyboard, "U",                85);
cnst(ASJS.Keyboard, "V",                86);
cnst(ASJS.Keyboard, "W",                87);
cnst(ASJS.Keyboard, "X",                88);
cnst(ASJS.Keyboard, "Y",                89);
cnst(ASJS.Keyboard, "Z",                90);
cnst(ASJS.Keyboard, "LEFT_WINDOW_KEY",  91);
cnst(ASJS.Keyboard, "RIGHT_WINDOW_KEY", 92);
cnst(ASJS.Keyboard, "SELECT_KEY",       93);
cnst(ASJS.Keyboard, "NUMPAD_0",         96);
cnst(ASJS.Keyboard, "NUMPAD_1",         97);
cnst(ASJS.Keyboard, "NUMPAD_2",         98);
cnst(ASJS.Keyboard, "NUMPAD_3",         99);
cnst(ASJS.Keyboard, "NUMPAD_4",         100);
cnst(ASJS.Keyboard, "NUMPAD_5",         101);
cnst(ASJS.Keyboard, "NUMPAD_6",         102);
cnst(ASJS.Keyboard, "NUMPAD_7",         103);
cnst(ASJS.Keyboard, "NUMPAD_8",         104);
cnst(ASJS.Keyboard, "NUMPAD_9",         105);
cnst(ASJS.Keyboard, "MULTIPLY",         106);
cnst(ASJS.Keyboard, "ADD",              107);
cnst(ASJS.Keyboard, "SUBTRACT",         109);
cnst(ASJS.Keyboard, "DECIMAL_POINT",    110);
cnst(ASJS.Keyboard, "DIVIDE",           111);
cnst(ASJS.Keyboard, "F1",               112);
cnst(ASJS.Keyboard, "F2",               113);
cnst(ASJS.Keyboard, "F3",               114);
cnst(ASJS.Keyboard, "F4",               115);
cnst(ASJS.Keyboard, "F5",               116);
cnst(ASJS.Keyboard, "F6",               117);
cnst(ASJS.Keyboard, "F7",               118);
cnst(ASJS.Keyboard, "F8",               119);
cnst(ASJS.Keyboard, "F9",               120);
cnst(ASJS.Keyboard, "F10",              121);
cnst(ASJS.Keyboard, "F11",              122);
cnst(ASJS.Keyboard, "F12",              123);
cnst(ASJS.Keyboard, "NUM_LOCK",         144);
cnst(ASJS.Keyboard, "SCROLL_LOCK",      145);
cnst(ASJS.Keyboard, "SEMICOLON",        186);
cnst(ASJS.Keyboard, "EQUAL_SIGN",       187);
cnst(ASJS.Keyboard, "COMMA",            188);
cnst(ASJS.Keyboard, "DASH",             189);
cnst(ASJS.Keyboard, "PERIOD",           190);
cnst(ASJS.Keyboard, "FORWARD_SLASH",    191);
cnst(ASJS.Keyboard, "GRAVE_ACCENT",     192);
cnst(ASJS.Keyboard, "OPEN_BRACKET",     219);
cnst(ASJS.Keyboard, "BACK_SLASH",       220);
cnst(ASJS.Keyboard, "CLOSE_BRAKET",     221);
cnst(ASJS.Keyboard, "SINGLE_QUOTE",     222);
