require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.BatchRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function BatchRenderer(config) {
    config.locations = config.locations.concat([
      "aMt"
    ]);

    AGL.BaseRenderer.call(this, config);

    this._matrixBuffer = new AGL.Buffer(
      this._MAX_BATCH_ITEMS,
      "aMt", 4, 4
    );
  },
  function(_scope, _super) {
    _scope._uploadBuffers = function() {
      this._matrixBuffer.upload(this._gl, this._enableBuffers, this._locations);
      _super._uploadBuffers.call(this);
    }

    _scope._createBuffers = function() {
      _super._createBuffers.call(this);
      this._matrixBuffer.create(this._gl);
    }
  }
);
