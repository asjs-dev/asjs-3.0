import "../../NameSpace.js";
import "./agl.TextureInfo.js";

AGL.Framebuffer = class extends AGL.TextureInfo {
  get width() { return this._width; }
  set width(v) {
    if (this._width !== v && v > 0) {
      this._width = v;
      ++this._updateId;
    }
  }

  get height() { return this._height; }
  set height(v) {
    if (this._height !== v && v > 0) {
      this._height = v;
      ++this._updateId;
    }
  }

  setSize(w, h) {
    this.width  = w;
    this.height = h;
  }

  bind(gl) {
    gl.bindFramebuffer(AGL.Const.FRAMEBUFFER, this._framebuffer);
  }

  unbind(gl) {
    gl.bindFramebuffer(AGL.Const.FRAMEBUFFER, null);
  }

  use(gl, id) {
    !this._update(gl, id) && this._currenActivetId !== id && this._use(gl, id);
  }

  _use(gl, id) {
    this.activeTexture(gl, id);
    gl.bindTexture(this.target, this._baseTexture);
  }

  _update(gl, id) {
    let result = false;

    if (this._currentAglId < gl.agl_id) {
      this._currentAglId = gl.agl_id;

      this._framebuffer = gl.createFramebuffer();

      this._baseTexture = gl.createTexture();

      this.useActiveTexture(gl, id);

      this.bind(gl);

      gl.framebufferTexture2D(
        AGL.Const.FRAMEBUFFER,
        AGL.Const.COLOR_ATTACHMENT0,
        AGL.Const.TEXTURE_2D,
        this._baseTexture,
        0
      );

      this.unbind(gl);

      result = true;
    }

    if (this._currentUpdateId < this._updateId) {
      this._currentUpdateId = this._updateId;
      this.useActiveTexture(gl, id);
      result = true;
    }

    return result;
  }
}
