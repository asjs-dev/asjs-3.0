require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.BatchRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function BatchRenderer(options) {
    options.config.locations = options.config.locations.concat([
      "aMt"
    ]);

    AGL.BaseRenderer.call(this, options);

    this._matrixBuffer = new AGL.Buffer(
      "aMt", this._MAX_BATCH_ITEMS,
      4, 4
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
