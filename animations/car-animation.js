import {
  translateMatricesAlongNormalAxis,
  getPositionsFromLevelMatrices,
} from "../curves/level-matrix-generator.js";
import { LUT } from "../curves/look-up-table.js";
import { RADIUS as WHEEL_RADIUS } from "../models/car/wheel.js";

export class CarAnimation {
  levelMatrices;
  lookUpTable;
  velocity;
  currentDistanceTravelled = 0;

  constructor(glMatrix, levelMatrices, velocity, normalOffset = 0) {
    this.levelMatrices = translateMatricesAlongNormalAxis(
      glMatrix,
      levelMatrices,
      normalOffset,
    );
    const pathVertices = getPositionsFromLevelMatrices(this.levelMatrices).map(
      (vertice) => [vertice[0], vertice[2]],
    );
    this.lookUpTable = new LUT(pathVertices);
    this.velocity = velocity;
  }

  getNewPositionAndRotationAngle(glMatrix) {
    let newDistanceTravelled = this.currentDistanceTravelled + this.velocity;
    if (newDistanceTravelled > this.lookUpTable.getTotalDistance())
      newDistanceTravelled -= this.lookUpTable.getTotalDistance();
    this.currentDistanceTravelled = newDistanceTravelled;
    const newPositionOnXZPlane =
      this.lookUpTable.getInterpolatedPoint(newDistanceTravelled);
    const newPosition = [newPositionOnXZPlane[0], 3, newPositionOnXZPlane[1]];

    const closestPointIndex =
      this.lookUpTable.getClosestPointAndIndex(newDistanceTravelled)[1];
    const closestLevelMatrix = this.levelMatrices[closestPointIndex];
    const tangent = closestLevelMatrix.slice(8, 12);
    const angle = glMatrix.vec3.angle(tangent, [1, 0, 0]);

    return { newPosition, angle };
  }
}
