import { Model } from "./model.js";
import { getGlBuffersFromBuffers } from "../gl/gl-buffers.js";

const SIDE_LENGTH = 5000;

export function getSkybox(gl, textureMap) {
  const positionBuffer = [];
  const normalBuffer = [];
  const uvBuffer = [];
  let indexBuffer = [];
  positionBuffer.push(
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    SIDE_LENGTH,
    0,
    0,
    SIDE_LENGTH,
    0,
    0,
    SIDE_LENGTH,
    0,
    0,
    0,
    SIDE_LENGTH,
    0,
    0,
    SIDE_LENGTH,
    0,
    0,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    0,
    0,
    0,
    SIDE_LENGTH,
    0,
    0,
    SIDE_LENGTH,
    0,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
    SIDE_LENGTH,
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

  uvBuffer.push(
    // A
    0.25,
    1 / 3,
    0.25,
    1 / 3,
    0.25,
    1 / 3,
    // D
    0.25,
    0,
    0,
    1 / 3,
    1,
    1 / 3,
    // B
    0.5,
    1 / 3,
    0.5,
    1 / 3,
    0.5,
    1 / 3,
    // C
    0.5,
    0,
    0.75,
    1 / 3,
    0.75,
    1 / 3,
    // E
    0.25,
    2 / 3,
    0.25,
    2 / 3,
    0.25,
    2 / 3,
    // H
    0.25,
    1,
    0,
    2 / 3,
    1,
    2 / 3,
    // F
    0.5,
    2 / 3,
    0.5,
    2 / 3,
    0.5,
    2 / 3,
    // G
    0.5,
    1,
    0.75,
    2 / 3,
    0.75,
    2 / 3,
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

  const glBuffers = getGlBuffersFromBuffers(
    gl,
    positionBuffer,
    normalBuffer,
    uvBuffer,
    indexBuffer,
  );
  const aux = new Model();
  const skybox = new Model(
    gl.TRIANGLES,
    glBuffers.glPositionBuffer,
    glBuffers.glNormalBuffer,
    glBuffers.glIndexBuffer,
    glBuffers.glUVBuffer,
    textureMap.getTexture("skybox"),
    false,
  );
  aux.addChild(skybox);

  skybox.translationVector = [
    -SIDE_LENGTH / 2,
    -SIDE_LENGTH / 2,
    -SIDE_LENGTH / 2,
  ];

  aux.rotationAxis = [1, 0, 0];
  aux.rotationDegree = Math.PI;
  return aux;
}
