require("../../NameSpace.js");
require("./agl.BasePositioningProps.js");

AGL.FilterTextureProps = helpers.createPrototypeClass(
  Object,
  function FilterTextureProps(filter, texture, translateX, translateY, cropX, cropY, cropWidth, cropHeight) {
    this._filter = filter;
    this.texture = texture;
    this.translateX = translateX || 0;
    this.translateY = translateY || 0;
    this.cropX = cropX || 0;
    this.cropY = cropY || 0;
    this.cropWidth = cropWidth || 1;
    this.cropHeight = cropHeight || 1;
  },
  function(_scope) {
    helpers.property(_scope, "translateX", {
      get: function() { return this._filter.v[1]; },
      set: function(v) { this._filter.v[1] = v; }
    });

    helpers.property(_scope, "translateY", {
      get: function() { return this._filter.v[2]; },
      set: function(v) { this._filter.v[2] = v; }
    });

    helpers.property(_scope, "cropX", {
      get: function() { return this._filter.v[3]; },
      set: function(v) { this._filter.v[3] = v; }
    });

    helpers.property(_scope, "cropY", {
      get: function() { return this._filter.v[4]; },
      set: function(v) { this._filter.v[4] = v; }
    });

    helpers.property(_scope, "cropWidth", {
      get: function() { return this._filter.v[5]; },
      set: function(v) { this._filter.v[5] = v; }
    });

    helpers.property(_scope, "cropHeight", {
      get: function() { return this._filter.v[6]; },
      set: function(v) { this._filter.v[6] = v; }
    });
  }
);
