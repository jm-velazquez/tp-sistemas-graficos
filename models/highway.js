import { generateLevelMatrices } from "../curves/level-matrix-generator.js";
import { Rectangle } from "../shapes/rectangle.js";
import { Trapezoid } from "../shapes/trapezoid.js";
import { generateSweepSurface } from "../surface-generator.js";
import { Model } from "../model.js";
import { LUT } from "../curves/look-up-table.js";
import { getStreetLight } from "./street-light.js";

function getLights(gl, glMatrix, levelMatrices, amountOfLights) {
	const levels = levelMatrices.map(levelMatrix => [levelMatrix[12], levelMatrix[14]]);
	const lut = new LUT(levels);
	const distance = lut.getTotalDistance() / (amountOfLights - 1);
	
	const streetLights = [];
	for (let i = 0; i < amountOfLights; i++) {
		const streetLight = getStreetLight(gl, glMatrix);
		const position = lut.getInterpolatedPoint(distance * i);
		
		// Get normal of the last level
		const levelMatrix = levelMatrices[levels.indexOf(lut.getClosestPoint(distance * i))];
		const normal = [levelMatrix[0], levelMatrix[1], levelMatrix[2]];
		
		const isEven = i % 2 === 0;
		streetLight.rotationAxis = [0,1,0];
		streetLight.rotationDegree = glMatrix.vec3.angle(normal, [0,0,1]) + Math.PI / 2 + isEven * Math.PI;
		streetLight.translationVector = [position[0], 2, position[1]];
		streetLights.push(streetLight);
	}
	return streetLights;
}

export function getHighway(gl, glMatrix, levels, amountOfLights) {
	const levelMatrices = generateLevelMatrices(glMatrix, levels);
	const roadShape = new Rectangle(50, 4);
	const roadArrays = roadShape.getPositionAndNormalArrays(glMatrix);
	const roadBuffers = generateSweepSurface(
		gl,
		glMatrix,
		roadArrays.positionArray,
		roadArrays.normalArray,
		levelMatrices,
		true,
		true
	);
	const guardrailShape = new Trapezoid(5,2.5,2);
	const guardrailArrays = guardrailShape.getPositionAndNormalArrays();
	const guardrailBuffers = generateSweepSurface(
		gl,
		glMatrix,
		guardrailArrays.positionArray,
		guardrailArrays.normalArray,
		levelMatrices,
		true,
		true
	);

	const guardrail = new Model(
		gl.TRIANGLE_STRIP,
		guardrailBuffers.glPositionBuffer,
		guardrailBuffers.glNormalBuffer,
		guardrailBuffers.glIndexBuffer,
	);
	guardrail.translationVector = [0, 3, 0];

	const highway = new Model(
		gl.TRIANGLE_STRIP,
		roadBuffers.glPositionBuffer,
		roadBuffers.glNormalBuffer,
		roadBuffers.glIndexBuffer,
	);
	highway.addChild(guardrail);
	const streetLights = getLights(gl, glMatrix, levelMatrices, amountOfLights);
	streetLights.forEach(streetLight => highway.addChild(streetLight));
	return highway;
}