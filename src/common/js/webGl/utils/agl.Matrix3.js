require("../NameSpace.js");

AGL.Matrix3 = {
  isPointInMatrix: function(
    vec,
    pm,
    cm,
    mdst,
    invDst
  ) {
    mdst[0] = pm[0] * cm[0] + pm[3] * cm[1];
    mdst[1] = pm[1] * cm[0] + pm[4] * cm[1];
    mdst[2] = pm[0] * cm[3] + pm[3] * cm[4];
    mdst[3] = pm[1] * cm[3] + pm[4] * cm[4];
    mdst[4] = pm[0] * cm[6] + pm[3] * cm[7] + pm[6];
    mdst[5] = pm[1] * cm[6] + pm[4] * cm[7] + pm[7];

    var d = 1 / (mdst[0] * mdst[3] - mdst[2] * mdst[1]);

    invDst[0] =  d * mdst[3];
    invDst[1] = -d * mdst[1];
    invDst[2] = -d * mdst[2];
    invDst[3] =  d * mdst[0];
    invDst[4] =  d * (mdst[2] * mdst[5] - mdst[3] * mdst[4]);
    invDst[5] = -d * (mdst[0] * mdst[5] - mdst[1] * mdst[4]);

    var x = vec[0] * invDst[0] + vec[1] * invDst[2] + invDst[4];
    var y = vec[0] * invDst[1] + vec[1] * invDst[3] + invDst[5];

    return x >= 0 && y >= 0 && x <= 1 && y <= 1;
  },
  identity: function() {
    return new Float32Array([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ]);
  },
  projection: function(width, height, dst) {
    dst[0] = 2 / width;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = -2 / height;
    dst[5] = 0;
    dst[6] = -1;
    dst[7] = 1;
    dst[8] = 1;
  },
  transformLocal: function(
    x, y,
    sr,
    cr,
    ax, ay,
    sx, sy,
    dst
  ) {
    dst[0] =  cr * sx;
    dst[1] =  sr * sx;
    dst[3] = -sr * sy;
    dst[4] =  cr * sy;
    dst[6] =  x - (ax * dst[0]) - (ay * dst[3]);
    dst[7] =  y - (ax * dst[1]) - (ay * dst[4]);
  },
  transform: function(
    m,
    x, y,
    sr,
    cr,
    ax, ay,
    sx, sy,
    dst
  ) {
    dst[0] = (cr * m[0]) + (sr * m[3]);
    dst[1] = (cr * m[1]) + (sr * m[4]);
    dst[3] = (cr * m[3]) - (sr * m[0]);
    dst[4] = (cr * m[4]) - (sr * m[1]);

    dst[6] = -(ax * dst[0]) - (ay * dst[3]) + (x * m[0]) + (y * m[3]) + m[6];
    dst[7] = -(ax * dst[1]) - (ay * dst[4]) + (x * m[1]) + (y * m[4]) + m[7];

    dst[0] *= sx;
    dst[1] *= sx;
    dst[3] *= sy;
    dst[4] *= sy;
  }
};

Object.freeze(AGL.Matrix3);
