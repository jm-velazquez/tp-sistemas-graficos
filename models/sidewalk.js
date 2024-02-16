import { Squircle } from "../shapes/squircle.js";
import { Model } from "../model.js";
import { generateSweepSurface } from "../surface-generator.js";

export const SIDEWALK_HEIGHT = 0.2;
export const BLOCK_SIDE = 100;
const BLOCK_CORNER_RADIUS = 10;

export function getSidewalk(gl, glMatrix, texture) {
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
		0,0,SIDEWALK_HEIGHT,1
	);
	const squircle = new Squircle(BLOCK_SIDE, BLOCK_CORNER_RADIUS, 1);
	const sidewalkBuffers = generateSweepSurface(
		gl,
		glMatrix,
		squircle,
		[level0Matrix, level1Matrix],
		false,
		true,
	);
	return new Model(
		gl.TRIANGLE_STRIP,
		sidewalkBuffers.glPositionBuffer,
		sidewalkBuffers.glNormalBuffer,
		sidewalkBuffers.glIndexBuffer,
		sidewalkBuffers.glUVBuffer,
		texture,
	);
}