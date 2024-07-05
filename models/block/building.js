export const MAX_BUILDING_STORIES = 6;
export const STORY_HEIGHT = 6;
export const BUILDING_SIDE = 20;

const MAX_BUILDING_HEIGHT = MAX_BUILDING_STORIES * STORY_HEIGHT;

export function getBuildingBuffers(
  gl,
  height,
  buildingVariation,
  xOffset = 0,
  yOffset = 0,
  zOffset = 0,
  indexBufferOffset = 0,
) {
  const positionBuffer = [];
  const normalBuffer = [];
  const uvBuffer = [];
  let indexBuffer = [];
  positionBuffer.push(
    xOffset,
    yOffset,
    zOffset, // 0
    xOffset,
    yOffset,
    zOffset, // 1
    xOffset,
    yOffset,
    zOffset, // 2
    xOffset + BUILDING_SIDE,
    yOffset,
    zOffset, // 3
    xOffset + BUILDING_SIDE,
    yOffset,
    zOffset, // 4
    xOffset + BUILDING_SIDE,
    yOffset,
    zOffset, // 5
    xOffset,
    yOffset + BUILDING_SIDE,
    zOffset, // 6
    xOffset,
    yOffset + BUILDING_SIDE,
    zOffset, // 7
    xOffset,
    yOffset + BUILDING_SIDE,
    zOffset, // 8
    xOffset + BUILDING_SIDE,
    yOffset + BUILDING_SIDE,
    zOffset, // 9
    xOffset + BUILDING_SIDE,
    yOffset + BUILDING_SIDE,
    zOffset, // 10
    xOffset + BUILDING_SIDE,
    yOffset + BUILDING_SIDE,
    zOffset, // 11
    xOffset,
    yOffset,
    zOffset + height, // 12
    xOffset,
    yOffset,
    zOffset + height, // 13
    xOffset,
    yOffset,
    zOffset + height, // 14
    xOffset + BUILDING_SIDE,
    yOffset,
    zOffset + height, // 15
    xOffset + BUILDING_SIDE,
    yOffset,
    zOffset + height, // 16
    xOffset + BUILDING_SIDE,
    yOffset,
    zOffset + height, // 17
    xOffset,
    yOffset + BUILDING_SIDE,
    zOffset + height, // 18
    xOffset,
    yOffset + BUILDING_SIDE,
    zOffset + height, // 19
    xOffset,
    yOffset + BUILDING_SIDE,
    zOffset + height, // 20
    xOffset + BUILDING_SIDE,
    yOffset + BUILDING_SIDE,
    zOffset + height, // 21
    xOffset + BUILDING_SIDE,
    yOffset + BUILDING_SIDE,
    zOffset + height, // 22
    xOffset + BUILDING_SIDE,
    yOffset + BUILDING_SIDE,
    zOffset + height, // 23
  );

  normalBuffer.push(
    0,
    0,
    -1, // 0
    0,
    -1,
    0, // 1
    -1,
    0,
    0, // 2
    0,
    0,
    -1, // 3
    0,
    -1,
    0, // 4
    1,
    0,
    0, // 5
    0,
    0,
    -1, // 6
    0,
    1,
    0, // 7
    -1,
    0,
    0, // 8
    0,
    0,
    -1, // 9
    0,
    1,
    0, // 10
    1,
    0,
    0, // 11
    0,
    0,
    1, // 12
    0,
    -1,
    0, // 13
    -1,
    0,
    0, // 14
    0,
    0,
    1, // 15
    0,
    -1,
    0, // 16
    1,
    0,
    0, // 17
    0,
    0,
    1, // 18
    0,
    1,
    0, // 19
    -1,
    0,
    0, // 20
    0,
    0,
    1, // 21
    0,
    1,
    0, // 22
    1,
    0,
    0, // 23
  );

  const maxHeightRatio = height / MAX_BUILDING_HEIGHT;
  const leftUVOffset = buildingVariation * 0.25;
  const rightUVOffset = leftUVOffset + 0.25;

  uvBuffer.push(
    leftUVOffset,
    0, // 0
    leftUVOffset,
    0, // 1
    rightUVOffset,
    0, // 2
    leftUVOffset,
    0, // 3
    rightUVOffset,
    0, // 4
    leftUVOffset,
    0, // 5
    leftUVOffset,
    0, // 6
    rightUVOffset,
    0, // 7
    leftUVOffset,
    0, // 8
    leftUVOffset,
    0, // 9
    leftUVOffset,
    0, // 10
    rightUVOffset,
    0, // 11
    leftUVOffset,
    0, // 12
    leftUVOffset,
    maxHeightRatio, // 13
    rightUVOffset,
    maxHeightRatio, // 14
    leftUVOffset,
    0, // 15
    rightUVOffset,
    maxHeightRatio, // 16
    leftUVOffset,
    maxHeightRatio, // 17
    leftUVOffset,
    0, // 18
    rightUVOffset,
    maxHeightRatio, // 19
    leftUVOffset,
    maxHeightRatio, // 20
    leftUVOffset,
    0, // 21
    leftUVOffset,
    maxHeightRatio, // 22
    rightUVOffset,
    maxHeightRatio, // 23
  );

  indexBuffer.push(
    0,
    3,
    6,
    3,
    6,
    9,
    1,
    4,
    16,
    1,
    13,
    16,
    2,
    14,
    8,
    14,
    8,
    20,
    7,
    10,
    22,
    7,
    19,
    22,
    5,
    17,
    23,
    5,
    23,
    11,
    12,
    15,
    18,
    15,
    18,
    21,
  );
  indexBuffer = indexBuffer.map((x) => x + indexBufferOffset);
  return { positionBuffer, normalBuffer, uvBuffer, indexBuffer };
}
