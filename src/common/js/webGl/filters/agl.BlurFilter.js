import "../NameSpace.js";
import "./agl.BaseFilter.js";

AGL.BlurFilter = class extends AGL.BaseFilter {
  constructor(intensityX, intensityY) {
    super(4, 1, intensityX);

    this.intensityY = intensityY;
  }
}
