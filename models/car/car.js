import { getWheel, WHEEL_DEPTH, RADIUS as WHEEL_RADIUS } from "./wheel.js";
import {
  getChasis,
  BASE_BASE_WIDTH,
  BASE_HEIGHT,
  BASE_DEPTH as CHASIS_DEPTH,
} from "./chasis.js";
import { Model } from "../model.js";

const WHEEL_DEPTH_OFFSET = CHASIS_DEPTH / 2.7;
const RIDE_HEIGHT = 0.2;

export function getCar(gl, glMatrix, textureMap, variation = "blue") {
  const car = new Model();

  // Front Axle
  const leftFrontWheel = getWheel(gl, glMatrix, textureMap.getTexture("black"));
  const rightFrontWheel = getWheel(
    gl,
    glMatrix,
    textureMap.getTexture("black"),
  );
  const frontAxle = new Model();
  leftFrontWheel.translationVector = [0, 0, -WHEEL_DEPTH_OFFSET - WHEEL_DEPTH];
  rightFrontWheel.translationVector = [0, 0, WHEEL_DEPTH_OFFSET];
  frontAxle.addChild(leftFrontWheel);
  frontAxle.addChild(rightFrontWheel);
  frontAxle.translationVector = [BASE_BASE_WIDTH / 3, WHEEL_RADIUS, 0];
  car.addChild(frontAxle);

  // Back Axle
  const leftBackWheel = getWheel(gl, glMatrix, textureMap.getTexture("black"));
  const rightBackWheel = getWheel(gl, glMatrix, textureMap.getTexture("black"));
  const backAxle = new Model();
  leftBackWheel.translationVector = [0, 0, -WHEEL_DEPTH_OFFSET - WHEEL_DEPTH];
  rightBackWheel.translationVector = [0, 0, WHEEL_DEPTH_OFFSET];
  backAxle.addChild(leftBackWheel);
  backAxle.addChild(rightBackWheel);
  backAxle.translationVector = [-BASE_BASE_WIDTH / 3, WHEEL_RADIUS, 0];
  car.addChild(backAxle);

  // Chasis
  const chasis = getChasis(gl, glMatrix, textureMap.getTexture(variation));
  chasis.translationVector = [
    0,
    BASE_HEIGHT / 2 + RIDE_HEIGHT,
    -CHASIS_DEPTH / 2,
  ];
  car.addChild(chasis);

  return car;
}
