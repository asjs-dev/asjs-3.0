require("../NameSpace.js");

AGL.BaseItem = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function BaseItem() {
    helpers.BasePrototypeClass.call(this);

    this.matrixCache = AGL.Matrix3.identity();

    this.colorUpdateId =
    this.propsUpdateId = 0;
    
    this.colorCache = [1, 1, 1, 1];
  }
);
