require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.MaskFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function MaskFilter(texture, type) {
    AGL.BaseFilter.call(this, 6, 0, type);

    this.texture = texture;
  }, function(_scope) {
    helpers.property(_scope, "type", {
      get: function() { return this.v[0]; },
      set: function(v) { this.v[0] = v; }
    });
  }
);

AGL.MaskFilter.Type = helpers.deepFreeze({
  RED   : 0,
  GREEN : 1,
  BLUE  : 2,
  ALPHA : 3,
  AVG   : 4
});
