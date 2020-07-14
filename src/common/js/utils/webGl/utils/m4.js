var m4 = (function() {
  var _scope = {};

  var PI = Math.PI;
  var PI_HALF = PI * 0.5;

  _scope.isPointInMatrix = function(
    vec,
    m,
    invDst, vecDst
  ) {
    _scope.inverse(m, invDst);
    _scope.multiplyVector(invDst, vec, vecDst);

    return vecDst[0] >= 0 && vecDst[1] >= 0 && vecDst[0] <= 1 && vecDst[1] <= 1;
  }

  _scope.transformTexture2D = function(
    x, y,
    rz,
    ax, ay,
    sx, sy,
    dst
  ) {
    var c = Math.cos(rz);
    var s = Math.sin(rz);

    dst[ 0] = c * sx;
    dst[ 1] = s * sx;
    dst[ 4] = -s * sy;
    dst[ 5] = c * sy;
    dst[12] = (dst[ 0] * -ax + dst[ 4] * -ay) + x;
    dst[13] = (dst[ 1] * -ax + dst[ 5] * -ay) + y;
  }

  _scope.transform2D = function(
    m,
    x, y, z,
    rx, ry, rz,
    ax, ay, az,
    sx, sy, sz,
    dst
  ) {
    m4.translateDst(m, x, y, z, dst);
    m4.zRotate(dst, rz);
    m4.translate(dst, -ax, -ay, 0);
    m4.scale(dst, sx, sy, 1);
  }

  _scope.transform = function(
    m,
    x, y, z,
    rx, ry, rz,
    ax, ay, az,
    sx, sy, sz,
    dst
  ) {
    m4.translateDst(m, x, y, z, dst);
    m4.xRotate(dst, rx);
    m4.yRotate(dst, ry);
    m4.zRotate(dst, rz);
    m4.translate(dst, -ax, -ay, -az);
    m4.scale(dst, sx, sy, sz);
  }

  _scope.multiply = function(a, b, dst) {
    dst[ 0] = b[ 0] * a[ 0] + b[ 1] * a[ 4] + b[ 2] * a[ 8] + b[ 3] * a[12];
    dst[ 1] = b[ 0] * a[ 1] + b[ 1] * a[ 5] + b[ 2] * a[ 9] + b[ 3] * a[13];
    dst[ 2] = b[ 0] * a[ 2] + b[ 1] * a[ 6] + b[ 2] * a[10] + b[ 3] * a[14];
    dst[ 3] = b[ 0] * a[ 3] + b[ 1] * a[ 7] + b[ 2] * a[11] + b[ 3] * a[15];
    dst[ 4] = b[ 4] * a[ 0] + b[ 5] * a[ 4] + b[ 6] * a[ 8] + b[ 7] * a[12];
    dst[ 5] = b[ 4] * a[ 1] + b[ 5] * a[ 5] + b[ 6] * a[ 9] + b[ 7] * a[13];
    dst[ 6] = b[ 4] * a[ 2] + b[ 5] * a[ 6] + b[ 6] * a[10] + b[ 7] * a[14];
    dst[ 7] = b[ 4] * a[ 3] + b[ 5] * a[ 7] + b[ 6] * a[11] + b[ 7] * a[15];
    dst[ 8] = b[ 8] * a[ 0] + b[ 9] * a[ 4] + b[10] * a[ 8] + b[11] * a[12];
    dst[ 9] = b[ 8] * a[ 1] + b[ 9] * a[ 5] + b[10] * a[ 9] + b[11] * a[13];
    dst[10] = b[ 8] * a[ 2] + b[ 9] * a[ 6] + b[10] * a[10] + b[11] * a[14];
    dst[11] = b[ 8] * a[ 3] + b[ 9] * a[ 7] + b[10] * a[11] + b[11] * a[15];
    dst[12] = b[12] * a[ 0] + b[13] * a[ 4] + b[14] * a[ 8] + b[15] * a[12];
    dst[13] = b[12] * a[ 1] + b[13] * a[ 5] + b[14] * a[ 9] + b[15] * a[13];
    dst[14] = b[12] * a[ 2] + b[13] * a[ 6] + b[14] * a[10] + b[15] * a[14];
    dst[15] = b[12] * a[ 3] + b[13] * a[ 7] + b[14] * a[11] + b[15] * a[15];
  }

  _scope.multiplyVector = function(a, b, dst) {
    dst[ 0] = b[ 0] * a[ 0] + b[ 1] * a[ 4] + b[ 2] * a[ 8] + b[ 3] * a[12];
    dst[ 1] = b[ 0] * a[ 1] + b[ 1] * a[ 5] + b[ 2] * a[ 9] + b[ 3] * a[13];
    dst[ 2] = b[ 0] * a[ 2] + b[ 1] * a[ 6] + b[ 2] * a[10] + b[ 3] * a[14];
    dst[ 3] = b[ 0] * a[ 3] + b[ 1] * a[ 7] + b[ 2] * a[11] + b[ 3] * a[15];
  }

  _scope.length = function(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  _scope.identity = function() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  _scope.perspective = function(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(PI_HALF - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return new Float32Array([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0
    ]);
  }

  _scope.orthographic = function(left, right, bottom, top, near, far) {
    return new Float32Array([
      2 / (right - left),
      0,
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      0,
      0,
      0,
      2 / (near - far),
      0,
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1
    ]);
  }

  _scope.frustum = function(left, right, bottom, top, near, far) {
    var dx = right - left;
    var dy = top - bottom;
    var dz = far - near;

    return new Float32Array([
      2 * near / dx,
      0,
      0,
      0,
      0,
      2 * near / dy,
      0,
      0,
      (left + right) / dx,
      (top + bottom) / dy,
      -(far + near) / dz,
      -1,
      0,
      0,
      -2 * near * far / dz,
      0
    ]);
  }

  _scope.translate = function(m, tx, ty, tz) {
    var m30 = m[12];
    var m31 = m[13];
    var m32 = m[14];
    var m33 = m[15];

    m[12] = m[ 0] * tx + m[ 4] * ty + m[ 8] * tz + m30;
    m[13] = m[ 1] * tx + m[ 5] * ty + m[ 9] * tz + m31;
    m[14] = m[ 2] * tx + m[ 6] * ty + m[10] * tz + m32;
    m[15] = m[ 3] * tx + m[ 7] * ty + m[11] * tz + m33;
  }

  _scope.translateDst = function(m, tx, ty, tz, dst) {
    dst[ 0] = m[ 0];
    dst[ 1] = m[ 1];
    dst[ 2] = m[ 2];
    dst[ 3] = m[ 3];
    dst[ 4] = m[ 4];
    dst[ 5] = m[ 5];
    dst[ 6] = m[ 6];
    dst[ 7] = m[ 7];
    dst[ 8] = m[ 8];
    dst[ 9] = m[ 9];
    dst[10] = m[10];
    dst[11] = m[11];
    dst[12] = m[ 0] * tx + m[ 4] * ty + m[ 8] * tz + m[12];
    dst[13] = m[ 1] * tx + m[ 5] * ty + m[ 9] * tz + m[13];
    dst[14] = m[ 2] * tx + m[ 6] * ty + m[10] * tz + m[14];
    dst[15] = m[ 3] * tx + m[ 7] * ty + m[11] * tz + m[15];
  }

  _scope.xRotation = function(angleInRadians, dst) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = 1;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = c;
    dst[ 6] = s;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = -s;
    dst[10] = c;
    dst[11] = 0;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 0;
    dst[15] = 1;
  }

  _scope.xRotate = function(m, angleInRadians) {
    var m10 = m[ 4];
    var m11 = m[ 5];
    var m12 = m[ 6];
    var m13 = m[ 7];
    var m20 = m[ 8];
    var m21 = m[ 9];
    var m22 = m[10];
    var m23 = m[11];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    m[ 4] = c * m10 + s * m20;
    m[ 5] = c * m11 + s * m21;
    m[ 6] = c * m12 + s * m22;
    m[ 7] = c * m13 + s * m23;
    m[ 8] = c * m20 - s * m10;
    m[ 9] = c * m21 - s * m11;
    m[10] = c * m22 - s * m12;
    m[11] = c * m23 - s * m13;
  }

  _scope.xRotateDst = function(m, angleInRadians, dst) {
    var m10 = m[ 4];
    var m11 = m[ 5];
    var m12 = m[ 6];
    var m13 = m[ 7];
    var m20 = m[ 8];
    var m21 = m[ 9];
    var m22 = m[10];
    var m23 = m[11];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 4] = c * m10 + s * m20;
    dst[ 5] = c * m11 + s * m21;
    dst[ 6] = c * m12 + s * m22;
    dst[ 7] = c * m13 + s * m23;
    dst[ 8] = c * m20 - s * m10;
    dst[ 9] = c * m21 - s * m11;
    dst[10] = c * m22 - s * m12;
    dst[11] = c * m23 - s * m13;

    dst[ 0] = m[ 0];
    dst[ 1] = m[ 1];
    dst[ 2] = m[ 2];
    dst[ 3] = m[ 3];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  _scope.yRotation = function(angleInRadians, dst) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = c;
    dst[ 1] = 0;
    dst[ 2] = -s;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 1;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = s;
    dst[ 9] = 0;
    dst[10] = c;
    dst[11] = 0;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 0;
    dst[15] = 1;
  }

  _scope.yRotate = function(m, angleInRadians) {
    var m00 = m[ 0];
    var m01 = m[ 1];
    var m02 = m[ 2];
    var m03 = m[ 3];
    var m20 = m[ 8];
    var m21 = m[ 9];
    var m22 = m[10];
    var m23 = m[11];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    m[ 0] = c * m00 - s * m20;
    m[ 1] = c * m01 - s * m21;
    m[ 2] = c * m02 - s * m22;
    m[ 3] = c * m03 - s * m23;
    m[ 8] = c * m20 + s * m00;
    m[ 9] = c * m21 + s * m01;
    m[10] = c * m22 + s * m02;
    m[11] = c * m23 + s * m03;
  }

  _scope.yRotateDst = function(m, angleInRadians, dst) {
    var m00 = m[ 0];
    var m01 = m[ 1];
    var m02 = m[ 2];
    var m03 = m[ 3];
    var m20 = m[ 8];
    var m21 = m[ 9];
    var m22 = m[10];
    var m23 = m[11];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = c * m00 - s * m20;
    dst[ 1] = c * m01 - s * m21;
    dst[ 2] = c * m02 - s * m22;
    dst[ 3] = c * m03 - s * m23;
    dst[ 8] = c * m20 + s * m00;
    dst[ 9] = c * m21 + s * m01;
    dst[10] = c * m22 + s * m02;
    dst[11] = c * m23 + s * m03;

    dst[ 4] = m[ 4];
    dst[ 5] = m[ 5];
    dst[ 6] = m[ 6];
    dst[ 7] = m[ 7];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  _scope.zRotation = function(angleInRadians, dst) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = c;
    dst[ 1] = s;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = -s;
    dst[ 5] = c;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 1;
    dst[11] = 0;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 0;
    dst[15] = 1;
  }

  _scope.zRotate = function(m, angleInRadians) {
    var m00 = m[ 0];
    var m01 = m[ 1];
    var m02 = m[ 2];
    var m03 = m[ 3];
    var m10 = m[ 4];
    var m11 = m[ 5];
    var m12 = m[ 6];
    var m13 = m[ 7];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    m[ 0] = c * m00 + s * m10;
    m[ 1] = c * m01 + s * m11;
    m[ 2] = c * m02 + s * m12;
    m[ 3] = c * m03 + s * m13;
    m[ 4] = c * m10 - s * m00;
    m[ 5] = c * m11 - s * m01;
    m[ 6] = c * m12 - s * m02;
    m[ 7] = c * m13 - s * m03;
  }

  _scope.zRotateDst = function(m, angleInRadians, dst) {
    var m00 = m[ 0];
    var m01 = m[ 1];
    var m02 = m[ 2];
    var m03 = m[ 3];
    var m10 = m[ 4];
    var m11 = m[ 5];
    var m12 = m[ 6];
    var m13 = m[ 7];
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    dst[ 0] = c * m00 + s * m10;
    dst[ 1] = c * m01 + s * m11;
    dst[ 2] = c * m02 + s * m12;
    dst[ 3] = c * m03 + s * m13;
    dst[ 4] = c * m10 - s * m00;
    dst[ 5] = c * m11 - s * m01;
    dst[ 6] = c * m12 - s * m02;
    dst[ 7] = c * m13 - s * m03;

    dst[ 8] = m[ 8];
    dst[ 9] = m[ 9];
    dst[10] = m[10];
    dst[11] = m[11];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  _scope.axisRotation = function(axis, angleInRadians, dst) {
    var x = axis[0];
    var y = axis[1];
    var z = axis[2];
    var n = Math.sqrt(x * x + y * y + z * z);
    x /= n;
    y /= n;
    z /= n;
    var xx = x * x;
    var yy = y * y;
    var zz = z * z;
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    var oneMinusCosine = 1 - c;

    dst[ 0] = xx + (1 - xx) * c;
    dst[ 1] = x * y * oneMinusCosine + z * s;
    dst[ 2] = x * z * oneMinusCosine - y * s;
    dst[ 3] = 0;
    dst[ 4] = x * y * oneMinusCosine - z * s;
    dst[ 5] = yy + (1 - yy) * c;
    dst[ 6] = y * z * oneMinusCosine + x * s;
    dst[ 7] = 0;
    dst[ 8] = x * z * oneMinusCosine + y * s;
    dst[ 9] = y * z * oneMinusCosine - x * s;
    dst[10] = zz + (1 - zz) * c;
    dst[11] = 0;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 0;
    dst[15] = 1;
  }

  _scope.axisRotate = function(m, axis, angleInRadians, dst) {
    var x = axis[0];
    var y = axis[1];
    var z = axis[2];
    var n = Math.sqrt(x * x + y * y + z * z);
    x /= n;
    y /= n;
    z /= n;
    var xx = x * x;
    var yy = y * y;
    var zz = z * z;
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    var oneMinusCosine = 1 - c;

    var r00 = xx + (1 - xx) * c;
    var r01 = x * y * oneMinusCosine + z * s;
    var r02 = x * z * oneMinusCosine - y * s;
    var r10 = x * y * oneMinusCosine - z * s;
    var r11 = yy + (1 - yy) * c;
    var r12 = y * z * oneMinusCosine + x * s;
    var r20 = x * z * oneMinusCosine + y * s;
    var r21 = y * z * oneMinusCosine - x * s;
    var r22 = zz + (1 - zz) * c;

    var m00 = m[0];
    var m01 = m[1];
    var m02 = m[2];
    var m03 = m[3];
    var m10 = m[4];
    var m11 = m[5];
    var m12 = m[6];
    var m13 = m[7];
    var m20 = m[8];
    var m21 = m[9];
    var m22 = m[10];
    var m23 = m[11];

    dst[ 0] = r00 * m00 + r01 * m10 + r02 * m20;
    dst[ 1] = r00 * m01 + r01 * m11 + r02 * m21;
    dst[ 2] = r00 * m02 + r01 * m12 + r02 * m22;
    dst[ 3] = r00 * m03 + r01 * m13 + r02 * m23;
    dst[ 4] = r10 * m00 + r11 * m10 + r12 * m20;
    dst[ 5] = r10 * m01 + r11 * m11 + r12 * m21;
    dst[ 6] = r10 * m02 + r11 * m12 + r12 * m22;
    dst[ 7] = r10 * m03 + r11 * m13 + r12 * m23;
    dst[ 8] = r20 * m00 + r21 * m10 + r22 * m20;
    dst[ 9] = r20 * m01 + r21 * m11 + r22 * m21;
    dst[10] = r20 * m02 + r21 * m12 + r22 * m22;
    dst[11] = r20 * m03 + r21 * m13 + r22 * m23;

    if (m !== dst) {
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }
  }

  _scope.scaling = function(sx, sy, sz, dst) {
    dst[ 0] = sx;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = sy;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = sz;
    dst[11] = 0;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 0;
    dst[15] = 1;
  }

  _scope.scale = function(m, sx, sy, sz) {
    m[ 0] = sx * m[ 0];
    m[ 1] = sx * m[ 1];
    m[ 2] = sx * m[ 2];
    m[ 3] = sx * m[ 3];
    m[ 4] = sy * m[ 4];
    m[ 5] = sy * m[ 5];
    m[ 6] = sy * m[ 6];
    m[ 7] = sy * m[ 7];
    m[ 8] = sz * m[ 8];
    m[ 9] = sz * m[ 9];
    m[10] = sz * m[10];
    m[11] = sz * m[11];
  }

  _scope.scaleDst = function(m, sx, sy, sz, dst) {
    dst[ 0] = sx * m[ 0];
    dst[ 1] = sx * m[ 1];
    dst[ 2] = sx * m[ 2];
    dst[ 3] = sx * m[ 3];
    dst[ 4] = sy * m[ 4];
    dst[ 5] = sy * m[ 5];
    dst[ 6] = sy * m[ 6];
    dst[ 7] = sy * m[ 7];
    dst[ 8] = sz * m[ 8];
    dst[ 9] = sz * m[ 9];
    dst[10] = sz * m[10];
    dst[11] = sz * m[11];
    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];
  }

  _scope.inverse = function(m, dst) {
    var m00 = m[ 0];
    var m01 = m[ 1];
    var m02 = m[ 2];
    var m03 = m[ 3];
    var m10 = m[ 4];
    var m11 = m[ 5];
    var m12 = m[ 6];
    var m13 = m[ 7];
    var m20 = m[ 8];
    var m21 = m[ 9];
    var m22 = m[10];
    var m23 = m[11];
    var m30 = m[12];
    var m31 = m[13];
    var m32 = m[14];
    var m33 = m[15];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    dst[ 0] = d * t0;
    dst[ 1] = d * t1;
    dst[ 2] = d * t2;
    dst[ 3] = d * t3;
    dst[ 4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    dst[ 5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    dst[ 6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    dst[ 7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    dst[ 8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    dst[ 9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  }

  return _scope;
})();
