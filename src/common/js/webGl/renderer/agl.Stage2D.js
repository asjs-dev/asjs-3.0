require("../NameSpace.js");
require("../display/agl.Item.js");
require("../geom/agl.Matrix3.js");
require("../data/agl.BlendMode.js");
require("../display/agl.Item.js");
require("../display/agl.Container.js");
require("../display/agl.StageContainer.js");
require("../utils/agl.Utils.js");
require("./agl.BaseRenderer.js");

AGL.Stage2D = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function Stage2D(options) {
    options                  = options || {};
    options.config           = AGL.Utils.initRendererConfig(options.config, AGL.Stage2D);
    options.config.locations = options.config.locations.concat([
      "aWCol",
      "aTCol",
      "aACol",
      "aFx"
    ]);

    this._container = new AGL.StageContainer(this);

    var maxBatchItems = this._MAX_BATCH_ITEMS = Math.max(1, options.maxBatchItems || 1e4);

    this._batchItems = 0;

    AGL.BaseRenderer.call(this, options.config);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE]      = helpers.emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE]     = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

    this._batchDrawBound = this._batchDraw.bind(this);

    /*
    this.picked;
    this._isPickerSet = false;
    */

    this.pickerPoint = AGL.Point.create();

    this._parentColorBuffer = new AGL.Buffer(
      maxBatchItems,
      "aWCol", 1, 4
    );

    this._tintColorBuffer = new AGL.Buffer(
      maxBatchItems,
      "aTCol", 1, 4
    );

    this._alphaBuffer = new AGL.Buffer(
      maxBatchItems,
      "aACol", 1, 2
    );

    this._effectBuffer = new AGL.Buffer(
      maxBatchItems,
      "aFx", 1, 4
    );
  },
  function(_scope, _super) {
    helpers.get(_scope, "container", function() { return this._container; });

    _scope.render = function() {
      this.picked = null;

      _super.render.call(this);

      this._isPickerSet = false;
    }

    _scope.setPickerPoint = function(point) {
      this._isPickerSet = true;

      this.pickerPoint.x = (point.x - this.widthHalf)  * this.matrixCache[0];
      this.pickerPoint.y = (point.y - this.heightHalf) * this.matrixCache[4];
    }

    _scope._render = function() {
      this._drawItem(this._container);
      this._batchDraw();
    }

    _scope._drawItem = function(item) {
      item.update(this._renderTime);
      item.callback(item, this._renderTime);
      item.renderable && this._drawFunctionMap[item.TYPE](item);
    }

    _scope._drawContainer = function(container) {
      var children = container.children;
      var l = children.length;
      for (var i = 0; i < l; ++i) this._drawItem(children[i]);
    }

    _scope._drawImage = function(item) {
      this._context.setBlendMode(item.blendMode, this._batchDrawBound);

      if (
        this._isPickerSet &&
        item.interactive &&
        item.isContainsPoint(this.pickerPoint)
      ) this.picked = item;

      var quadId = this._batchItems * 4;
      var duoId  = this._batchItems * 2;

      helpers.arraySet(this._parentColorBuffer.data, item.parent.colorCache, quadId);
      helpers.arraySet(this._tintColorBuffer.data,   item.colorCache,        quadId);

      this._alphaBuffer.data[duoId]     = item.props.alpha;
      this._alphaBuffer.data[duoId + 1] = item.parent.props.alpha;

      this._effectBuffer.data[quadId] = this._context.useTexture(
        item.texture,
        this._renderTime,
        false,
        this._batchDrawBound
      );
      this._effectBuffer.data[quadId + 1] = item.tintType;

      var matId  = this._batchItems * 16;

      helpers.arraySet(this._matrixBuffer.data, item.matrixCache,        matId);
      helpers.arraySet(this._matrixBuffer.data, item.textureMatrixCache, matId + 6);
      helpers.arraySet(this._matrixBuffer.data, item.textureCropCache,   matId + 12);

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    _scope._batchDraw = function() {
      if (this._batchItems > 0) {
        this._uploadBuffers();

        this._gl.uniform1iv(this._locations.uTex, this._context.textureIds);

        this._drawInstanced(this._batchItems);

        this._batchItems = 0;
      }
    }

    _scope._resize = function() {
      var isResized = _super._resize.call(this);
      if (isResized) {
        AGL.Matrix3.projection(this._width, this._height, this._container.parent.matrixCache);
        ++this._container.parent.propsUpdateId;
      }
      return isResized;
    }

    _scope._uploadBuffers = function() {
      var gl            = this._gl;
      var locations     = this._locations;
      var enableBuffers = this._enableBuffers;

      this._parentColorBuffer.upload(gl, enableBuffers, locations);
      this._tintColorBuffer.upload(gl,   enableBuffers, locations);
      this._alphaBuffer.upload(gl,       enableBuffers, locations);
      this._effectBuffer.upload(gl,      enableBuffers, locations);

      _super._uploadBuffers.call(this);
    }

    _scope._createBuffers = function() {
      _super._createBuffers.call(this);

      var gl = this._gl;

      this._parentColorBuffer.create(gl);
      this._tintColorBuffer.create(gl);
      this._alphaBuffer.create(gl);
      this._effectBuffer.create(gl);
    }

    _scope._createVertexShader = function(config) {
      return AGL.Utils.createVersion(config.precision) +

      "in vec2 aPos;" +
      "in mat4 aMt;" +
      "in vec4 aWCol;" +
      "in vec4 aTCol;" +
      "in vec2 aACol;" +
      "in vec4 aFx;" +

      "uniform float uFlpY;" +

      "out vec2 vTCrd;" +
      "out vec4 vTexCrop;" +
      "out mat2x4 vCol;" +
      "out float vACol;" +
      "out float vTexId;" +
      "out float vTTp;" +

      "void main(void){" +
        "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
        "mat3 tMt=mat3(aMt[1].zw,0,aMt[2].xy,0,aMt[2].zw,1);" +
        "vec3 pos=vec3(aPos,1);" +
        "gl_Position=vec4(mt*pos,1);" +
        "gl_Position.y*=uFlpY;" +
        "vTCrd=(tMt*pos).xy;" +
        "vTexCrop=aMt[3];" +

        "vCol=mat2x4(aWCol,aTCol.rgb*aTCol.a,1.-aTCol.a);" +
        "vACol=aACol.x*aACol.y;" +

        "vTexId=aFx.x;" +
        "vTTp=aFx.y;" +
      "}";
    };

    _scope._createFragmentShader = function(config) {
      function createGetTextureFunction(maxTextureImageUnits) {
        var func =
        "vec4 gtTexCol(float i,vec2 c){" +
          "if(i<0.)return vec4(1);";

        for (var i = 0; i < maxTextureImageUnits; ++i) func +=
          "else if(i<" + (i + 1) + ".)return texture(uTex[" + i + "],c);";

        func +=
          "return vec4(0);" +
        "}";
        return func;
      }

      var maxTextureImageUnits = AGL.Utils.info.maxTextureImageUnits;

      return AGL.Utils.createVersion(config.precision) +

      "in vec2 vTCrd;" +
      "in vec4 vTexCrop;" +
      "in mat2x4 vCol;" +
      "in float vACol;" +
      "in float vTexId;" +
      "in float vTTp;" +

      "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +

      "out vec4 fgCol;" +

      createGetTextureFunction(maxTextureImageUnits) +

      "void main(void){" +
        "fgCol=gtTexCol(vTexId,vTexCrop.xy+vTexCrop.zw*mod(vTCrd,1.));" +
        "fgCol.a*=vACol;" +

        "if(fgCol.a==0.)discard;" +

        "if(vTTp>0.){" +
          "vec3 col=vCol[1].rgb+fgCol.rgb*vCol[1].a;" +
          "if(vTTp<2.||(vTTp<3.&&fgCol.r==fgCol.g&&fgCol.r==fgCol.b))" +
            "fgCol.rgb*=col;" +
          "else if(vTTp<4.)" +
            "fgCol.rgb=col;" +
        "}" +

        "fgCol*=vCol[0];" +
      "}";
    };
  }
);
