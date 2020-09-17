require("./agl.Item.js");
require("../NameSpace.js");

AGL.Container = createPrototypeClass(
  AGL.Item,
  function Container() {
    AGL.Item.call(this);

    cnst(this, "type", AGL.Container.TYPE);

    this._curWrldPrpsId = -1;
    this._curWrldColId  = -1;

    this._chldrn = [];

    this.worldPropsUpdateId =
    this.worldColorUpdateId = 0;

    this.colorCache = [1, 1, 1, 1];
  },
  function() {
    get(this, "children",    function() { return this._chldrn; });
    get(this, "numChildren", function() { return this._chldrn.length; });

    this.clear = function() {
      while (this.numChildren) this.removeChildAt(0);
    }

    this.contains = function(child) {
      return this.getChildIndex(child) > -1;
    }

    this.addChild = function(child) {
      return this.addChildAt(child, this.numChildren);
    }

    this.addChildAt = function(child, index) {
      if (!child) return null;
      if (child.parent) child.parent.removeChild(child);
      this._chldrn.push(child);
      this.setChildIndex(child, index);
      child.parent = this;
      return child;
    }

    this.removeChild = function(child) {
      if (!child || !this.contains(child)) return null;
      _chldrn.remove(child);
      child.parent = null;
      return child;
    }

    this.removeChildAt = function(index) {
      return this.removeChild(this.getChildAt(index));
    }

    this.getChildAt = function(index) {
      return this._chldrn[index];
    }

    this.setChildIndex = function(child, index) {
      if (!child || index < 0) return null;
      this._chldrn.remove(child);
      this._chldrn.splice(index, 0, child);
      return child;
    }

    this.getChildIndex = function(child) {
      return this._chldrn.indexOf(child);
    }

    this.swapChildren = function(childA, childB) {
      var childAIndex = this.getChildIndex(childA);
      var childBIndex = this.getChildIndex(childB);
      if (childAIndex === -1 || childBIndex === -1) return false;
      this.setChildIndex(childA, childBIndex);
      this.setChildIndex(childB, childAIndex);
      return true;
    }

    this.update = function(renderTime, parent) {
      this._updateProps(parent);
      this._updateColor(parent);
    }

    this._updateProps = function(parent) {
      var props = this.props;

      if (this._curWrldPrpsId < parent.worldPropsUpdateId || props.isUpdated()) {
        this._curWrldPrpsId = parent.worldPropsUpdateId;
        this.worldPropsUpdateId++;

        this._transformItem(props, parent);
      }
    }

    this._updateColor = function(parent) {
      var color = this.color;

      if (this._curWrldColId < parent.worldColorUpdateId || color.isUpdated()) {
        this._curWrldColId = parent.worldColorUpdateId;
        this.worldColorUpdateId++;

        var parentColor = parent.colorCache;

        this.colorCache[0] = parentColor[0] * color.r;
        this.colorCache[1] = parentColor[1] * color.g;
        this.colorCache[2] = parentColor[2] * color.b;
        this.colorCache[3] = parentColor[3] * color.a;
      }
    }
  }
);
cnst(AGL.Container, "TYPE", "container");
