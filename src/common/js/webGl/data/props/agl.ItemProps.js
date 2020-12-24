require("../../NameSpace.js");
require("./agl.AbstractPositioningProps.js");

AGL.ItemProps = helpers.createPrototypeClass(
  AGL.AbstractPositioningProps,
  function ItemProps() {
    AGL.AbstractPositioningProps.call(this);

    this._scaleUpdateId         =
    this._currentScaleUpdateId  = 0;

    this.scaledWidth  =
    this.scaledHeight =

    this._scaleX =
    this._scaleY =
    this._width  =
    this._height =
    this.alpha   = 1;
  },
  function(_scope) {
    helpers.property(_scope, "scaleX", {
      get: function() { return this._scaleX; },
      set: function(v) {
        if (this._scaleX !== v) {
          this._scaleX = v;
          this._scaleUpdateId = AGL.CurrentTime;
        }
      }
    });

    helpers.property(_scope, "scaleY", {
      get: function() { return this._scaleY; },
      set: function(v) {
        if (this._scaleY !== v) {
          this._scaleY = v;
          this._scaleUpdateId = AGL.CurrentTime;
        }
      }
    });

    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          this._scaleUpdateId = AGL.CurrentTime;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          this._scaleUpdateId = AGL.CurrentTime;
        }
      }
    });

    _scope.updateScale = function() {
      if (this._currentScaleUpdateId < this._scaleUpdateId) {
        this._currentScaleUpdateId = this._scaleUpdateId;
        this.updateId = AGL.CurrentTime;

        this.scaledWidth  = this._width  * this._scaleX;
        this.scaledHeight = this._height * this._scaleY;
      }
    }
  }
);
