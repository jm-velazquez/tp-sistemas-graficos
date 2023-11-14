export const DEPTH = 0.2;
export const RADIUS = 0.25;
const DEFINITION = 20;

import { Circle } from "../shapes/circle.js";
import { Model } from "../model.js";
import { generateSweepSurface } from "../surface-generator.js";

export function getWheel(gl, glMatrix) {
	let level0Matrix = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	);

	let level1Matrix = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,DEPTH,1
	);
   
	const circle = new Circle(RADIUS);
	const circleArrays = circle.getPositionAndNormalArrays(DEFINITION);
	const cylinderBuffers = generateSweepSurface(
		gl,
		glMatrix,
		circleArrays.positionArray,
		circleArrays.normalArray,
		[level0Matrix, level1Matrix],
		true,
		true,
	);
	return new Model(
		gl.TRIANGLE_STRIP,
		cylinderBuffers.glPositionBuffer,
		cylinderBuffers.glNormalBuffer,
		cylinderBuffers.glIndexBuffer
	);
}