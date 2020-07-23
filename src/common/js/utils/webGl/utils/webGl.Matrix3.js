(function() {
  createUtility(WebGl, "Matrix3");
  var m3 = WebGl.Matrix3;

  rof(m3, "isPointInMatrix", function(
    vec,
    m,
    invDst, vecDst
  ) {
    var t00 = m[4] - m[5] * m[7];
    var t10 = m[1] - m[2] * m[7];
    var t20 = m[1] * m[5] - m[2] * m[4];
    var d = 1 / (m[0] * t00 - m[3] * t10 + m[6] * t20);

    invDst[0] =  d * t00;
    invDst[1] = -d * t10;
    invDst[2] =  d * t20;
    invDst[3] = -d * (m[3] - m[5] * m[6]);
    invDst[4] =  d * (m[0] - m[2] * m[6]);
    invDst[5] = -d * (m[0] * m[5] - m[2] * m[3]);
    invDst[6] =  d * (m[3] * m[7] - m[4] * m[6]);
    invDst[7] = -d * (m[0] * m[7] - m[1] * m[6]);
    invDst[8] =  d * (m[0] * m[4] - m[1] * m[3]);

    vecDst[0] = vec[0] * invDst[0] + vec[1] * invDst[3] + invDst[6];
    vecDst[1] = vec[0] * invDst[1] + vec[1] * invDst[4] + invDst[7];

    return vecDst[0] >= 0 && vecDst[1] >= 0 && vecDst[0] <= 1 && vecDst[1] <= 1;
  });
  /*
  rof(m3, "multiplyVector", function(a, b, dst) {
    dst[0] = b[0] * a[0] + b[1] * a[3] + a[6];
    dst[1] = b[0] * a[1] + b[1] * a[4] + a[7];
  });
  */
  rof(m3, "identity", function() {
    return new Float32Array([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ]);
  });

  rof(m3, "projection", function(width, height) {
    return new Float32Array([
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1,
    ]);
  });

  rof(m3, "transformTexture", function(
    x, y,
    r,
    ax, ay,
    sx, sy,
    dst
  ) {
    var c = Math.cos(r);
    var s = Math.sin(r);

    dst[0] = c * sx;
    dst[1] = s * sx;
    dst[3] = -s * sy;
    dst[4] = c * sy;
    dst[6] = (dst[0] * -ax + dst[3] * -ay) + y;
    dst[7] = (dst[1] * -ax + dst[4] * -ay) + x;
  });
  /*
  rof(m3, "transform", function(
    m,
    x, y,
    r,
    ax, ay,
    sx, sy,
    dst
  ) {
    m3.translateDst(m, x, y, dst);
    m3.rotate(dst, r);
    m3.translate(dst, -ax, -ay);
    m3.scale(dst, sx, sy);
  });
  */

  rof(m3, "transform", function(
    m,
    x, y,
    r,
    ax, ay,
    sx, sy,
    dst
  ) {
    var c = Math.cos(r);
    var s = Math.sin(r);

    dst[0] = c * m[0] + s * m[3];
    dst[1] = c * m[1] + s * m[4];
    dst[3] = c * m[3] - s * m[0];
    dst[4] = c * m[4] - s * m[1];

    dst[6] = -ax * dst[0] - ay * dst[3] + x * m[0] + y * m[3] + m[6];
    dst[7] = -ax * dst[1] - ay * dst[4] + x * m[1] + y * m[4] + m[7];

    dst[0] *= sx;
    dst[1] *= sx;
    dst[3] *= sy;
    dst[4] *= sy;
  });
  /*
  rof(m3, "translateDst", function(m, tx, ty, dst) {
    dst[0] = m[0];
    dst[1] = m[1];
    dst[2] = m[2];
    dst[3] = m[3];
    dst[4] = m[4];
    dst[5] = m[5];
    dst[6] = m[0] * tx + m[3] * ty + m[6];
    dst[7] = m[1] * tx + m[4] * ty + m[7];
    dst[8] = m[2] * tx + m[5] * ty + 1;
  });

  rof(m3, "translate", function(m, tx, ty) {
    m[6] = m[0] * tx + m[3] * ty + m[6];
    m[7] = m[1] * tx + m[4] * ty + m[7];
    m[8] = m[2] * tx + m[5] * ty + 1;
  });

  rof(m3, "scale", function(m, sx, sy) {
    m[0] = sx * m[0];
    m[1] = sx * m[1];
    m[2] = sx * m[2];
    m[3] = sy * m[3];
    m[4] = sy * m[4];
    m[5] = sy * m[5];
  });

  rof(m3, "rotate", function(m, r) {
    var m00 = m[0];
    var m01 = m[1];
    var m02 = m[2];
    var m10 = m[3];
    var m11 = m[4];
    var m12 = m[5];

    var c = Math.cos(r);
    var s = Math.sin(r);

    m[0] = c * m00 + s * m10;
    m[1] = c * m01 + s * m11;
    m[2] = c * m02 + s * m12;
    m[3] = c * m10 - s * m00;
    m[4] = c * m11 - s * m01;
    m[5] = c * m12 - s * m02;
  });

  rof(m3, "inverse", function(m, dst) {
    var t00 = m[4] - m[5] * m[7];
    var t10 = m[1] - m[2] * m[7];
    var t20 = m[1] * m[5] - m[2] * m[4];
    var d = 1 / (m[0] * t00 - m[3] * t10 + m[6] * t20);

    dst[0] =  d * t00;
    dst[1] = -d * t10;
    dst[2] =  d * t20;
    dst[3] = -d * (m[3] - m[5] * m[6]);
    dst[4] =  d * (m[0] - m[2] * m[6]);
    dst[5] = -d * (m[0] * m[5] - m[2] * m[3]);
    dst[6] =  d * (m[3] * m[7] - m[4] * m[6]);
    dst[7] = -d * (m[0] * m[7] - m[1] * m[6]);
    dst[8] =  d * (m[0] * m[4] - m[1] * m[3]);
  });
  */
})();
