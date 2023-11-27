import { LUT } from "../curves/look-up-table.js";
import { 
	translateMatricesAlongNormalAxis,
	reverseLevelMatrices,
	getPositionsFromLevelMatrices,
	generateLevelMatrices,
} from "../curves/level-matrix-generator.js";

const LANE_DISTANCE = 6.25;
const LANE_VELOCITIES = [1, 1.2, 1.4,1.4, 1.2, 1];

export class CarPositions {
	LUTs = [];
	levelMatrices = [];
	currentDistanceSums = Array(6).fill(0);

	constructor(glMatrix, levels) {
		const levelMatrices = generateLevelMatrices(glMatrix, levels);
		const reversedLevelMatrices = reverseLevelMatrices(glMatrix, levelMatrices);
		this.levelMatrices.push(translateMatricesAlongNormalAxis(
			glMatrix,
			reversedLevelMatrices,
			LANE_DISTANCE * 3,
		));
		this.levelMatrices.push(translateMatricesAlongNormalAxis(
			glMatrix,
			reversedLevelMatrices,
			LANE_DISTANCE * 2,
		));
		this.levelMatrices.push(translateMatricesAlongNormalAxis(
			glMatrix,
			reversedLevelMatrices,
			LANE_DISTANCE,
		));
		this.levelMatrices.push(translateMatricesAlongNormalAxis(
			glMatrix,
			levelMatrices,
			LANE_DISTANCE,
		));
		this.levelMatrices.push(translateMatricesAlongNormalAxis(
			glMatrix,
			levelMatrices,
			LANE_DISTANCE * 2,
		));
		this.levelMatrices.push(translateMatricesAlongNormalAxis(
			glMatrix,
			levelMatrices,
			LANE_DISTANCE * 3,
		));
		this.LUTs.push(
			...this.levelMatrices.map(
				levelMatrices => new LUT(getPositionsFromLevelMatrices(levelMatrices))
			)
		); 
	}

	getNewPositionAndRotationAngle(glMatrix, laneNumber) {
		let newDistanceSum = this.currentDistanceSums[laneNumber] + LANE_VELOCITIES[laneNumber];
		if (newDistanceSum > this.LUTs[laneNumber].getTotalDistance()) newDistanceSum -= this.LUTs[laneNumber].getTotalDistance();
		const newPositionOnXZPlane = this.LUTs[laneNumber].getInterpolatedPoint(newDistanceSum);
		const index = this.LUTs[laneNumber].getClosestPointAndIndex(newDistanceSum)[1];
		const newLevelMatrix = this.levelMatrices[laneNumber][index];
		const tangent = newLevelMatrix.slice(8, 12);
		const angle = glMatrix.vec3.angle(tangent, [1,0,0]);
		this.currentDistanceSums[laneNumber] = newDistanceSum;
		const newPosition = [newPositionOnXZPlane[0], 0, newPositionOnXZPlane[1]];
		return [newPosition, angle];
	}

	getNewPositionsAndRotationAngles(glMatrix) {
		const results = [];
		for (let i = 0; i < 6; i++) {
			results.push(this.getNewPositionAndRotationAngle(glMatrix, i));
		}
		return results;
	}
}