import { reverseLevelMatrices } from "../curves/level-matrix-generator.js";
import { CarAnimation } from "./car-animation.js";

const LANE_OFFSETS = [21, 12, 4, 4, 12, 21];
const LANE_VELOCITIES = [0.5, 0.6, 0.7, 0.7, 0.6, 0.5];

export class CarAnimations {
  carAnimations = [];

  constructor(glMatrix, levelMatrices) {
    const reversedLevelMatrices = reverseLevelMatrices(
      glMatrix,
      levelMatrices,
    ).reverse();

    this.carAnimations.push(
      new CarAnimation(
        glMatrix,
        levelMatrices,
        LANE_VELOCITIES[0],
        LANE_OFFSETS[0],
      ),
    );

    this.carAnimations.push(
      new CarAnimation(
        glMatrix,
        levelMatrices,
        LANE_VELOCITIES[1],
        LANE_OFFSETS[1],
      ),
    );

    this.carAnimations.push(
      new CarAnimation(
        glMatrix,
        levelMatrices,
        LANE_VELOCITIES[2],
        LANE_OFFSETS[2],
      ),
    );

    this.carAnimations.push(
      new CarAnimation(
        glMatrix,
        reversedLevelMatrices,
        LANE_VELOCITIES[3],
        LANE_OFFSETS[3],
      ),
    );

    this.carAnimations.push(
      new CarAnimation(
        glMatrix,
        reversedLevelMatrices,
        LANE_VELOCITIES[4],
        LANE_OFFSETS[4],
      ),
    );

    this.carAnimations.push(
      new CarAnimation(
        glMatrix,
        reversedLevelMatrices,
        LANE_VELOCITIES[5],
        LANE_OFFSETS[5],
      ),
    );
  }

  getCarsAnimationInfo(glMatrix) {
    const animationInfoPerCar = this.carAnimations.map((carAnimation) =>
      carAnimation.getNewPositionAndRotationAngle(glMatrix),
    );
    for (let i = 0; i < 3; i++) {
      animationInfoPerCar[i].angle = -animationInfoPerCar[i].angle;
    }
    return animationInfoPerCar;
  }
}
