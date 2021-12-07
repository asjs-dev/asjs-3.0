import helpers from "../../helpers/NameSpace.js";
import "../NameSpace.js";
import "./agl.BaseFilter.js";

AGL.SaturateFilter = class extends AGL.BaseFilter {
  constructor(intensity) {
    super(2, 0, intensity);
  }

  set intensity(v) {
    this.v[0] = v;

    const x = (v * 2 / 3) + 1;
    const y = ((x - 1) * - .5);

    helpers.arraySet(this.kernels, [
      x, y, y, 0,
      y, x, y, 0,
      y, y, x, 0
    ], 0);
  }
}
