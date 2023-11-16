import { generateLevelMatrices } from "../curves/level-matrix-generator.js";
import { Rectangle } from "../shapes/rectangle.js";
import { Trapezoid } from "../shapes/trapezoid.js";
import { generateSweepSurface } from "../surface-generator.js";
import { Model } from "../model.js";

export function getHighway(gl, glMatrix, levels) {
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
	return highway;
}