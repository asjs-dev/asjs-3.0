import helpers from "../../helpers/NameSpace.js";
import "../NameSpace.js";
import "./agl.BaseFilter.js";

AGL.SharpenFilter = class extends AGL.BaseFilter {
  constructor(intensity) {
    super(1, 0, intensity);

    helpers.arraySet(this.kernels, [
      -1,  -1,  -1,
      -1,  16,  -1,
      -1,  -1,  -1
    ], 0);
  }
}
