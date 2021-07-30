require("../../NameSpace.js");

AGL.DistortionProps = helpers.createPrototypeClass(
  Object,
  function DistortionProps() {
    this.items = [
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ];
  },
  function(_scope) {
    helpers.property(_scope, "topLeftX", {
      get: function() { return this.items[0]; },
      set: function(v) { this.items[0] = v; }
    });

    helpers.property(_scope, "topLeftY", {
      get: function() { return this.items[1]; },
      set: function(v) { this.items[1] = v; }
    });

    helpers.property(_scope, "topRightX", {
      get: function() { return this.items[2]; },
      set: function(v) { this.items[2] = v; }
    });

    helpers.property(_scope, "topRightY", {
      get: function() { return this.items[3]; },
      set: function(v) { this.items[3] = v; }
    });

    helpers.property(_scope, "bottomRightX", {
      get: function() { return this.items[4]; },
      set: function(v) { this.items[4] = v; }
    });

    helpers.property(_scope, "bottomRightY", {
      get: function() { return this.items[5]; },
      set: function(v) { this.items[5] = v; }
    });

    helpers.property(_scope, "bottomLeftX", {
      get: function() { return this.items[6]; },
      set: function(v) { this.items[6] = v; }
    });

    helpers.property(_scope, "bottomLeftY", {
      get: function() { return this.items[7]; },
      set: function(v) { this.items[7] = v; }
    });
  }
);
