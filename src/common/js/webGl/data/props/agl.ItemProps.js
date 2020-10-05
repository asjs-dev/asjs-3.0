require("../../NameSpace.js");
require("./agl.AbstractPositioningProps.js");

AGL.ItemProps = helpers.createPrototypeClass(
  AGL.AbstractPositioningProps,
  function ItemProps() {
    AGL.AbstractPositioningProps.call(this);

    this._scaledWidthUpdateId         =
    this._currentScaledWidthUpdateId  =

    this._scaledHeightUpdateId        =
    this._currentScaledHeightUpdateId = 0;

    this._scaledWidth  =
    this._scaledHeight =

    this._scaleX   =
    this._scaleY   =
    this._width    =
    this._height   = 1;
  },
  function(_scope) {
    helpers.get(_scope, "scaledWidth", function() {
      if (this._currentScaledWidthUpdateId !== this._scaledWidthUpdateId) {
        this._currentScaledWidthUpdateId = this._scaledWidthUpdateId;
        this._scaledWidth = this._width * this._scaleX;
      }
      return this._scaledWidth;
    });

    helpers.get(_scope, "scaledHeight", function() {
      if (this._currentScaledHeightUpdateId !== this._scaledHeightUpdateId) {
        this._currentScaledHeightUpdateId = this._scaledHeightUpdateId;
        this._scaledHeight = this._height * this._scaleY;
      }
      return this._scaledHeight;
    });

    helpers.property(_scope, "scaleX", {
      get: function() { return this._scaleX; },
      set: function(v) {
        if (this._scaleX !== v) {
          this._scaleX = v;
          ++this._scaledWidthUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "scaleY", {
      get: function() { return this._scaleY; },
      set: function(v) {
        if (this._scaleY !== v) {
          this._scaleY = v;
          ++this._scaledHeightUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          ++this._scaledWidthUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          ++this._scaledHeightUpdateId;
          ++this._id;
        }
      }
    });
  }
);
