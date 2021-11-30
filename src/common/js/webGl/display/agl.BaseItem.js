import "../NameSpace.js";

AGL.BaseItem = class extends helpers.BasePrototypeClass {
  constructor() {
    super();

    this.matrixCache = AGL.Matrix3.identity();

    this.colorUpdateId =
    this.propsUpdateId = 0;

    this.colorCache = [1, 1, 1, 1];
  }
}
