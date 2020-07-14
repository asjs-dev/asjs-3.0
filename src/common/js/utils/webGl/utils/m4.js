var m4 = (function() {
  var _scope = {};

  var PI = Math.PI;
  var PI_HALF = PI * 0.5;
  var PI_2 = PI * 2;
  var QUARTER_ROTATION = 90 * (PI / 180);

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
  /*
  _scope.addVectors = function(a, b, dst) {
    dst[0] = a[0] + b[0];
    dst[1] = a[1] + b[1];
    dst[2] = a[2] + b[2];
  }

  _scope.subtractVectors = function(a, b, dst) {
    dst[0] = a[0] - b[0];
    dst[1] = a[1] - b[1];
    dst[2] = a[2] - b[2];
  }

  _scope.scaleVector = function(v, s, dst) {
    dst[0] = v[0] * s;
    dst[1] = v[1] * s;
    dst[2] = v[2] * s;
  }

  _scope.normalize = function(v, dst) {
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

    if (length > 0.00001) {
      dst[0] = v[0] / length;
      dst[1] = v[1] / length;
      dst[2] = v[2] / length;
    }
  }
  */
  _scope.length = function(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }
  /*
  _scope.lengthSq = function(v) {
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
  }

  _scope.cross = function(a, b, dst) {
    dst[0] = a[1] * b[2] - a[2] * b[1];
    dst[1] = a[2] * b[0] - a[0] * b[2];
    dst[2] = a[0] * b[1] - a[1] * b[0];
  }

  _scope.dot = function(a, b) {
    return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
  }

  _scope.distanceSq = function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
  }

  _scope.distance = function(a, b) {
    return Math.sqrt(_scope.distanceSq(a, b));
  }
  */
  _scope.identity = function() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }
  /*
  _scope.transpose = function(m, dst) {
    dst[ 0] = m[ 0];
    dst[ 1] = m[ 4];
    dst[ 2] = m[ 8];
    dst[ 3] = m[12];
    dst[ 4] = m[ 1];
    dst[ 5] = m[ 5];
    dst[ 6] = m[ 9];
    dst[ 7] = m[13];
    dst[ 8] = m[ 2];
    dst[ 9] = m[ 6];
    dst[10] = m[10];
    dst[11] = m[14];
    dst[12] = m[ 3];
    dst[13] = m[ 7];
    dst[14] = m[11];
    dst[15] = m[15];
  }

  _scope.lookAt = function(cameraPosition, target, up, dst) {
    var zAxis = _scope.normalize(_scope.subtractVectors(cameraPosition, target));
    var xAxis = _scope.normalize(_scope.cross(up, zAxis));
    var yAxis = _scope.normalize(_scope.cross(zAxis, xAxis));

    dst[ 0] = xAxis[0];
    dst[ 1] = xAxis[1];
    dst[ 2] = xAxis[2];
    dst[ 3] = 0;
    dst[ 4] = yAxis[0];
    dst[ 5] = yAxis[1];
    dst[ 6] = yAxis[2];
    dst[ 7] = 0;
    dst[ 8] = zAxis[0];
    dst[ 9] = zAxis[1];
    dst[10] = zAxis[2];
    dst[11] = 0;
    dst[12] = cameraPosition[0];
    dst[13] = cameraPosition[1];
    dst[14] = cameraPosition[2];
    dst[15] = 1;
  }
  */
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
  /*
  _scope.translation = function(tx, ty, tz, dst) {
    dst[ 0] = 1;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 1;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 1;
    dst[11] = 0;
    dst[12] = tx;
    dst[13] = ty;
    dst[14] = tz;
    dst[15] = 1;
  }
  */
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
  /*
  _scope.compose = function(translation, quaternion, scale, dst) {
    var x = quaternion[0];
    var y = quaternion[1];
    var z = quaternion[2];
    var w = quaternion[3];

    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;

    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;

    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;

    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;

    var sx = scale[0];
    var sy = scale[1];
    var sz = scale[2];

    dst[0] = (1 - (yy + zz)) * sx;
    dst[1] = (xy + wz) * sx;
    dst[2] = (xz - wy) * sx;
    dst[3] = 0;

    dst[4] = (xy - wz) * sy;
    dst[5] = (1 - (xx + zz)) * sy;
    dst[6] = (yz + wx) * sy;
    dst[7] = 0;

    dst[ 8] = (xz + wy) * sz;
    dst[ 9] = (yz - wx) * sz;
    dst[10] = (1 - (xx + yy)) * sz;
    dst[11] = 0;

    dst[12] = translation[0];
    dst[13] = translation[1];
    dst[14] = translation[2];
    dst[15] = 1;
  }

  _scope.quatFromRotationMatrix = function(m, dst) {
    var m11 = m[0];
    var m12 = m[4];
    var m13 = m[8];
    var m21 = m[1];
    var m22 = m[5];
    var m23 = m[9];
    var m31 = m[2];
    var m32 = m[6];
    var m33 = m[10];

    var trace = m11 + m22 + m33;

    if (trace > 0) {
      var s = 0.5 / Math.sqrt(trace + 1);
      dst[3] = 0.25 / s;
      dst[0] = (m32 - m23) * s;
      dst[1] = (m13 - m31) * s;
      dst[2] = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      var s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      dst[3] = (m32 - m23) / s;
      dst[0] = 0.25 * s;
      dst[1] = (m12 + m21) / s;
      dst[2] = (m13 + m31) / s;
    } else if (m22 > m33) {
      var s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      dst[3] = (m13 - m31) / s;
      dst[0] = (m12 + m21) / s;
      dst[1] = 0.25 * s;
      dst[2] = (m23 + m32) / s;
    } else {
      var s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      dst[3] = (m21 - m12) / s;
      dst[0] = (m13 + m31) / s;
      dst[1] = (m23 + m32) / s;
      dst[2] = 0.25 * s;
    }
  }

  _scope.decompose2D = function(mat, dst) {
    //var denom  = (mat[0] * mat[0]) + (mat[1] * mat[1]);
    dst[0] = -Math.atan2(mat[1], mat[0]);
    //dst[1] = Math.sqrt(denom);
    //dst[2] = (mat[0] * mat[5] - mat[4] * mat[1]) / dst[1];
    dst[1] = Math.sqrt((mat[0] * mat[0]) + (mat[1] * mat[1]));
    dst[2] = Math.sqrt((mat[4] * mat[4]) + (mat[5] * mat[5]));

    /*
    var a = mat[0];
    var b = mat[1];
    var c = mat[4];
    var d = mat[5];

    var skewX = -Math.atan2(-c, d);
    var skewY = Math.atan2(b, a);

    var delta = Math.abs(skewX + skewY);

    if (delta < 0.00001 || Math.abs(PI_2 - delta) < 0.00001) {
        dst[0] = skewY;
        dst[1] = dst[2] = 0;
    } else {
        dst[0] = 0;
        dst[1] = skewX;
        dst[2] = skewY;
    }

    dst[3] = a;
    dst[4] = d;

    dst[5] = mat[12];
    dst[6] = mat[13];
    * /
  }
  /*
  _scope.decompose = function(mat, translation, quaternion, scale) {
    var sx = _scope.length(mat.slice(0, 3));
    var sy = _scope.length(mat.slice(4, 7));
    var sz = _scope.length(mat.slice(8, 11));

    var det = _scope.determinate(mat);
    if (det < 0) sx = -sx;

    translation[0] = mat[12];
    translation[1] = mat[13];
    translation[2] = mat[14];

    var matrix = _scope.copy(mat);

    var invSX = 1 / sx;
    var invSY = 1 / sy;
    var invSZ = 1 / sz;

    matrix[0] *= invSX;
    matrix[1] *= invSX;
    matrix[2] *= invSX;

    matrix[4] *= invSY;
    matrix[5] *= invSY;
    matrix[6] *= invSY;

    matrix[8] *= invSZ;
    matrix[9] *= invSZ;
    matrix[10] *= invSZ;

    _scope.quatFromRotationMatrix(matrix, quaternion);

    scale[0] = sx;
    scale[1] = sy;
    scale[2] = sz;
  }

  _scope.determinate = function(m) {
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

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    return 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  }
  */
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
  /*
  _scope.transformVector = function(m, v, dst) {
    for (var i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; ++j) {
        dst[i] += v[j] * m[j * 4 + i];
      }
    }
  }

  _scope.transformPoint = function(m, v, dst) {
    var v0 = v[0];
    var v1 = v[1];
    var v2 = v[2];
    var d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];

    dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
    dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
    dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;
  }

  _scope.transformDirection = function(m, v, dst) {
    var v0 = v[0];
    var v1 = v[1];
    var v2 = v[2];

    dst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0];
    dst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1];
    dst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2];
  }

  _scope.transformNormal = function(m, v, dst) {
    var mi = _scope.inverse(m);
    var v0 = v[0];
    var v1 = v[1];
    var v2 = v[2];

    dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
    dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
    dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];
  }

  _scope.copy = function(src, dst) {
    dst[ 0] = src[ 0];
    dst[ 1] = src[ 1];
    dst[ 2] = src[ 2];
    dst[ 3] = src[ 3];
    dst[ 4] = src[ 4];
    dst[ 5] = src[ 5];
    dst[ 6] = src[ 6];
    dst[ 7] = src[ 7];
    dst[ 8] = src[ 8];
    dst[ 9] = src[ 9];
    dst[10] = src[10];
    dst[11] = src[11];
    dst[12] = src[12];
    dst[13] = src[13];
    dst[14] = src[14];
    dst[15] = src[15];
  }
  */
  return _scope;
})();
