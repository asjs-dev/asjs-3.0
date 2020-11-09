require("../NameSpace.js");

AGL.Matrix3 = {
  isPointInMatrix: function(
    vector,
    parentMatrix,
    matrix,
    destinationMatrix,
    destinationMatrixInverse
  ) {
    destinationMatrix[0] = parentMatrix[0] * matrix[0] + parentMatrix[3] * matrix[1];
    destinationMatrix[1] = parentMatrix[1] * matrix[0] + parentMatrix[4] * matrix[1];
    destinationMatrix[2] = parentMatrix[0] * matrix[3] + parentMatrix[3] * matrix[4];
    destinationMatrix[3] = parentMatrix[1] * matrix[3] + parentMatrix[4] * matrix[4];
    destinationMatrix[4] = parentMatrix[0] * matrix[6] + parentMatrix[3] * matrix[7] + parentMatrix[6];
    destinationMatrix[5] = parentMatrix[1] * matrix[6] + parentMatrix[4] * matrix[7] + parentMatrix[7];

    var d = 1 / (destinationMatrix[0] * destinationMatrix[3] - destinationMatrix[2] * destinationMatrix[1]);

    destinationMatrixInverse[0] =  d * destinationMatrix[3];
    destinationMatrixInverse[1] = -d * destinationMatrix[1];
    destinationMatrixInverse[2] = -d * destinationMatrix[2];
    destinationMatrixInverse[3] =  d * destinationMatrix[0];
    destinationMatrixInverse[4] =  d * (destinationMatrix[2] * destinationMatrix[5] - destinationMatrix[3] * destinationMatrix[4]);
    destinationMatrixInverse[5] = -d * (destinationMatrix[0] * destinationMatrix[5] - destinationMatrix[1] * destinationMatrix[4]);

    var x = vector[0] * destinationMatrixInverse[0] + vector[1] * destinationMatrixInverse[2] + destinationMatrixInverse[4];
    var y = vector[0] * destinationMatrixInverse[1] + vector[1] * destinationMatrixInverse[3] + destinationMatrixInverse[5];

    return x >= 0 && y >= 0 && x <= 1 && y <= 1;
  },
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
    sinRotation, cosRotation,
    anchorX, anchorY,
    scaleX, scaleY,
    destinationMatrix
  ) {
    destinationMatrix[0] =  cosRotation * scaleX;
    destinationMatrix[1] =  sinRotation * scaleX;
    destinationMatrix[3] = -sinRotation * scaleY;
    destinationMatrix[4] =  cosRotation * scaleY;
    destinationMatrix[6] =  x - anchorX * destinationMatrix[0] - anchorY * destinationMatrix[3];
    destinationMatrix[7] =  y - anchorX * destinationMatrix[1] - anchorY * destinationMatrix[4];
  },
  transform: function(
    matrix,
    x, y,
    sinRotation, cosRotation,
    anchorX, anchorY,
    scaleX, scaleY,
    destinationMatrix
  ) {
    destinationMatrix[0] = cosRotation * matrix[0] + sinRotation * matrix[3];
    destinationMatrix[1] = cosRotation * matrix[1] + sinRotation * matrix[4];
    destinationMatrix[3] = cosRotation * matrix[3] - sinRotation * matrix[0];
    destinationMatrix[4] = cosRotation * matrix[4] - sinRotation * matrix[1];

    destinationMatrix[6] = -anchorX * destinationMatrix[0] - anchorY * destinationMatrix[3] + x * matrix[0] + y * matrix[3] + matrix[6];
    destinationMatrix[7] = -anchorX * destinationMatrix[1] - anchorY * destinationMatrix[4] + x * matrix[1] + y * matrix[4] + matrix[7];

    destinationMatrix[0] *= scaleX;
    destinationMatrix[1] *= scaleX;
    destinationMatrix[3] *= scaleY;
    destinationMatrix[4] *= scaleY;
  }
};

helpers.deepFreeze(AGL.Matrix3);
