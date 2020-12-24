require("../NameSpace.js");

AGL.Matrix3 = {
  identity: function() {
    return new Float32Array([
      1, 0,
      0, 1,
      0, 0
    ]);
  },
  projection: function(
    width,
    height,
    destinationMatrix
  ) {
    destinationMatrix[0] = 2 / width;
    destinationMatrix[1] =
    destinationMatrix[2] = 0;
    destinationMatrix[3] = -2 / height;
    destinationMatrix[4] = -1;
    destinationMatrix[5] = 1;
  },
  transformLocal: function(
    props,
    destinationMatrix
  ) {
    destinationMatrix[0] =   props.cosRotationA * props.scaledWidth;
    destinationMatrix[1] =   props.sinRotationA * props.scaledWidth;
    destinationMatrix[2] = - props.sinRotationB * props.scaledHeight;
    destinationMatrix[3] =   props.cosRotationB * props.scaledHeight;
    destinationMatrix[4] =   props.x -
                             props.anchorX * destinationMatrix[0] -
                             props.anchorY * destinationMatrix[2];
    destinationMatrix[5] =   props.y -
                             props.anchorX * destinationMatrix[1] -
                             props.anchorY * destinationMatrix[3];
  },
  transform: function(
    matrix,
    props,
    destinationMatrix
  ) {
    destinationMatrix[0] = (props.cosRotationA * matrix[0] + props.sinRotationA * matrix[2]) * props.scaledWidth;
    destinationMatrix[1] = (props.cosRotationA * matrix[1] + props.sinRotationA * matrix[3]) * props.scaledWidth;
    destinationMatrix[2] = (props.cosRotationB * matrix[2] - props.sinRotationB * matrix[0]) * props.scaledHeight;
    destinationMatrix[3] = (props.cosRotationB * matrix[3] - props.sinRotationB * matrix[1]) * props.scaledHeight;

    destinationMatrix[4] = - props.anchorX * destinationMatrix[0]
                           - props.anchorY * destinationMatrix[2]
                           + props.x * matrix[0]
                           + props.y * matrix[2]
                           + matrix[4];
    destinationMatrix[5] = - props.anchorX * destinationMatrix[1]
                           - props.anchorY * destinationMatrix[3]
                           + props.x * matrix[1]
                           + props.y * matrix[3]
                           + matrix[5];
  },
  inverse: function(matrix, destinationMatrix) {
    var det = 1 / (matrix[0] * matrix[3] - matrix[2] * matrix[1]);

    destinationMatrix[0] =  det * matrix[3];
    destinationMatrix[1] = -det * matrix[1];
    destinationMatrix[2] = -det * matrix[2];
    destinationMatrix[3] =  det * matrix[0];
    destinationMatrix[4] =  det * (matrix[2] * matrix[5] - matrix[3] * matrix[4]);
    destinationMatrix[5] = -det * (matrix[0] * matrix[5] - matrix[1] * matrix[4]);
  },
  isPointInMatrix: function(matrix, point) {
    var x = point.x * matrix[0] + point.y * matrix[2] + matrix[4];
    var y = point.x * matrix[1] + point.y * matrix[3] + matrix[5];

    return x >= 0 && x <= 1 && y >= 0 && y <= 1;
  },
  calcCorners: function(matrix, corners, resolution) {
    corners[0].x = resolution.widthHalf + matrix[4] * resolution.widthHalf;
    corners[0].y = resolution.height - (resolution.heightHalf + matrix[5] * resolution.heightHalf);
    corners[1].x = corners[0].x + (matrix[0] + matrix[2]) * resolution.widthHalf;
    corners[1].y = corners[0].y - (matrix[1] + matrix[3]) * resolution.heightHalf;
    corners[2].x = corners[0].x + (matrix[0] + resolution.widthHalf * matrix[2]);
    corners[2].y = corners[0].y - (matrix[1] + resolution.heightHalf * matrix[3]);
    corners[3].x = corners[0].x + (resolution.widthHalf * matrix[0] + matrix[2]);
    corners[3].y = corners[0].y - (resolution.heightHalf * matrix[1] + matrix[3]);
  }
};
