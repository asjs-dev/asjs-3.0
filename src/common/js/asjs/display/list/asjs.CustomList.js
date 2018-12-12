require("../asjs.Sprite.js");
require("./asjs.Cell.js");

ASJS.CustomList = createClass(
"CustomList",
ASJS.Sprite,
function(_scope, _super) {
  var _multiselect    = false;
  var _cell           = ASJS.Cell;
  var _lastCellIndex  = 0;
  var _itemsContainer = new ASJS.Sprite("ul");
  var _name           = "";

  _scope.new = function() {
    _super.new();
    _itemsContainer.setCSS("position", "relative");
    _itemsContainer.setSize("auto", "auto");
    _itemsContainer.addEventListener(ASJS.Cell.CLICK, onCellClick);
    _scope.addChild(_itemsContainer);
  }

  get(_scope, "length", function() { return _itemsContainer.numChildren; });

  set(_scope, "cell", function(v) { _cell = v; });

  prop(_scope, "multiselect", {
    get: function() { return _multiselect; },
    set: function(v) { _multiselect = v; }
  });

  prop(_scope, "selected", {
    get: function() {
      var v = [];
      var i = -1;
      var l = _scope.length;
      while (++i < l) {
        var item = _scope.getCellAt(i);
        if (item.checked) v.push(item);
      }
      return v;
    },
    set: function(v) {
      _scope.clearSelection();

      var j = -1;
      var l = _scope.length;
      var vLength = _scope.multiselect ? v.length : 1;
      while (++j < vLength) {
        var i = -1;
        while (++i < l) {
          if (i == v[j]) _scope.getCellAt(i).checked = true;
        }
      }
    }
  });

  prop(_scope, "name", {
    get: function() { return _name; },
    set: function(v) {
      _name = v;
      var i = -1;
      var l = _scope.length;
      while (++i < l) _scope.getCellAt(i).name = _name;
    }
  });

  _scope.clearSelection = function() {
    var i = -1;
    var l = _scope.length;
    while (++i < l) _scope.getCellAt(i).checked = false;
  }

  _scope.clearList = function() {
    while (_scope.length > 0) _itemsContainer.removeChildAt(0);
  }

  _scope.setList = function(cellDataVoList) {
    _scope.clearList();
    var i = -1;
    var l = cellDataVoList.length;
    while (++i < l) _scope.addItem(cellDataVoList[ i ]);
  }

  _scope.getList = function() {
    var list = [];
    var i = -1;
    var l = _scope.length;
    while (++i < l) list.push(_scope.getItemAt(i));
    return list;
  }

  _scope.getCellAt = function(index) {
    return index < 0 || index >= _scope.length ? null : _itemsContainer.getChildAt(index);
  }

  _scope.getItemAt = function(index) {
    var cell = _scope.getCellAt(index);
    return cell ? cell.data : null;
  }

  _scope.getCellById = function(id) {
    var i = -1;
    var l = _scope.length;
    while (++i < l) {
      var cell = _scope.getCellAt(i);
      if (cell.id == id) return cell;
    }
    return null;
  }

  _scope.getItemById = function(id) {
    var cell = _scope.getCellById(id);
    return cell ? cell.data : null;
  }

  _scope.addItem = function(cellDataVo) {
    var cell = new _cell();
    cell.name = _name;
    cell.data = cellDataVo;
    return _itemsContainer.addChild(cell);
  }

  _scope.addItemAt = function(cellDataVo, index) {
    return _itemsContainer.setChildIndex(_scope.addItem(cellDataVo), index);
  }

  _scope.removeCell = function(cell) {
    if (!cell || !_itemsContainer.contains(cell)) return;
    _itemsContainer.removeChild(cell);
  }

  _scope.removeCellById = function(id) {
    _scope.removeCell(_scope.getCellById(id));
  }

  _scope.render = function() {
    var i = -1;
    var l = _scope.length;
    while (++i < l) {
      var cell = _scope.getCellAt(i);
      cell.setSize(_scope.width, _scope.height);
      cell.render();
    }
  }

  _scope.destruct = function() {
    _multiselect    = null;
    _cell           = null;
    _lastCellIndex  = null;
    _name           = null;
    
    destructClass(_itemsContainer);
    _itemsContainer = null;

    _super.destruct();
  }

  function onCellClick(e) {
    var cell = _itemsContainer.getChildByDOMObject(e.target);
    if (!cell) return;

    if (!_scope.multiselect || (!e.detail.ctrlKey && !e.detail.shiftKey)) _scope.clearSelection();

    cell.checked = e.detail.ctrlKey ? !cell.checked : true;
    var cellIndex = _itemsContainer.getChildIndex(cell);

    if (_scope.multiselect && !e.detail.ctrlKey && e.detail.shiftKey) {
      var i = -1;
      var l = Math.abs(cellIndex - _lastCellIndex);
      var step = cellIndex > _lastCellIndex ? -1 : 1;
      while (++i < l) {
        cell = _scope.getCellAt(cellIndex + ((i + 1) * step));
        cell.checked = true;
      }
    }
    _lastCellIndex = cellIndex;

    _scope.dispatchEvent(ASJS.CustomList.CHANGE);
  }
});
msg(ASJS.CustomList, "CHANGE");
