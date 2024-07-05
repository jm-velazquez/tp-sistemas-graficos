export function getStreetBuffers(
  streetWidth,
  streetLength,
  xOffset = 0,
  yOffset = 0,
  isHorizontal = false,
  lengthUVMultiplier = 1,
  indexBufferOffset = 0,
) {
  const xSide = isHorizontal ? streetLength : streetWidth;
  const ySide = isHorizontal ? streetWidth : streetLength;

  // Uses TRIANGLES primitive
  const positionBuffer = [
    xOffset - xSide / 2,
    yOffset - ySide / 2,
    0,
    xOffset - xSide / 2,
    yOffset + ySide / 2,
    0,
    xOffset + xSide / 2,
    yOffset - ySide / 2,
    0,
    xOffset - xSide / 2,
    yOffset + ySide / 2,
    0,
    xOffset + xSide / 2,
    yOffset - ySide / 2,
    0,
    xOffset + xSide / 2,
    yOffset + ySide / 2,
    0,
  ];

  const normalBuffer = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
  let uvBuffer;
  if (isHorizontal) {
    uvBuffer = [
      0.5,
      0,
      0,
      0,
      0.5,
      1 * lengthUVMultiplier,
      0,
      0,
      0.5,
      1 * lengthUVMultiplier,
      0,
      1 * lengthUVMultiplier,
    ];
  } else {
    uvBuffer = [
      0,
      0,
      0,
      1 * lengthUVMultiplier,
      0.5,
      0,
      0,
      1 * lengthUVMultiplier,
      0.5,
      0,
      0.5,
      1 * lengthUVMultiplier,
    ];
  }

  let indexBuffer = [0, 1, 2, 3, 4, 5];
  indexBuffer = indexBuffer.map((x) => x + indexBufferOffset);
  return { positionBuffer, normalBuffer, uvBuffer, indexBuffer };
}
