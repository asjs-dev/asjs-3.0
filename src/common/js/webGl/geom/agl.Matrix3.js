require("../NameSpace.js");

AGL.Matrix3 = {
  identity: function() {
    return new Float32Array([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ]);
  },
  projection: function(
    width,
    height,
    destinationMatrix
  ) {
    destinationMatrix[0] = 2 / width;
    destinationMatrix[1] =
    destinationMatrix[2] =
    destinationMatrix[3] =
    destinationMatrix[5] = 0;
    destinationMatrix[4] = -2 / height;
    destinationMatrix[6] = -1;
    destinationMatrix[7] =
    destinationMatrix[8] = 1;
  },
  transformLocal: function(
    x, y,
    sinRotationA, cosRotationA,
    sinRotationB, cosRotationB,
    anchorX, anchorY,
    scaleX, scaleY,
    destinationMatrix
  ) {
    destinationMatrix[0] =   cosRotationA * scaleX;
    destinationMatrix[1] =   sinRotationA * scaleX;
    destinationMatrix[3] = - sinRotationB * scaleY;
    destinationMatrix[4] =   cosRotationB * scaleY;
    destinationMatrix[6] =   x - anchorX * destinationMatrix[0] - anchorY * destinationMatrix[3];
    destinationMatrix[7] =   y - anchorX * destinationMatrix[1] - anchorY * destinationMatrix[4];
  },
  transform: function(
    matrix,
    x, y,
    sinRotationA, cosRotationA,
    sinRotationB, cosRotationB,
    anchorX, anchorY,
    scaleX, scaleY,
    destinationMatrix
  ) {
    destinationMatrix[0] = (cosRotationA * matrix[0] + sinRotationA * matrix[3]) * scaleX;
    destinationMatrix[1] = (cosRotationA * matrix[1] + sinRotationA * matrix[4]) * scaleX;
    destinationMatrix[3] = (cosRotationB * matrix[3] - sinRotationB * matrix[0]) * scaleY;
    destinationMatrix[4] = (cosRotationB * matrix[4] - sinRotationB * matrix[1]) * scaleY;

    destinationMatrix[6] = - anchorX * destinationMatrix[0]
                           - anchorY * destinationMatrix[3]
                           + x * matrix[0]
                           + y * matrix[3]
                           + matrix[6];
    destinationMatrix[7] = - anchorX * destinationMatrix[1]
                           - anchorY * destinationMatrix[4]
                           + x * matrix[1]
                           + y * matrix[4]
                           + matrix[7];
  },
  inverse: function(matrix, destinationMatrix) {
    var det = 1 / (matrix[0] * matrix[4] - matrix[3] * matrix[1]);

    destinationMatrix[0] =  det * matrix[4];
    destinationMatrix[1] = -det * matrix[1];
    destinationMatrix[2] = -det * matrix[3];
    destinationMatrix[3] =  det * matrix[0];
    destinationMatrix[4] =  det * (matrix[3] * matrix[7] - matrix[4] * matrix[6]);
    destinationMatrix[5] = -det * (matrix[0] * matrix[7] - matrix[1] * matrix[6]);
  },
  isPointInMatrix: function(matrix, point) {
    var x = point.x * matrix[0] + point.y * matrix[2] + matrix[4];
    var y = point.x * matrix[1] + point.y * matrix[3] + matrix[5];

    return x >= 0 && x <= 1 && y >= 0 && y <= 1;
  },
  calcCorners: function(matrix, corners, resolution) {
    corners[0].x = resolution.widthHalf + matrix[6] * resolution.widthHalf;
    corners[0].y = resolution.height - (resolution.heightHalf + matrix[7] * resolution.heightHalf);
    corners[1].x = corners[0].x + (matrix[0] + matrix[3]) * resolution.widthHalf;
    corners[1].y = corners[0].y - (matrix[1] + matrix[4]) * resolution.heightHalf;
    corners[2].x = corners[0].x + (matrix[0] + resolution.widthHalf * matrix[3]);
    corners[2].y = corners[0].y - (matrix[1] + resolution.heightHalf * matrix[4]);
    corners[3].x = corners[0].x + (resolution.widthHalf * matrix[0] + matrix[3]);
    corners[3].y = corners[0].y - (resolution.heightHalf * matrix[1] + matrix[4]);
  }
};
