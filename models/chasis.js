export const BASE_BASE_WIDTH = 3;
const BASE_TOP_WIDTH = 2.5;
export const BASE_HEIGHT = 0.6;
export const BASE_DEPTH = 1;

const TOP_BASE_WIDTH = 2;
const TOP_TOP_WIDTH = 1.5;
const TOP_HEIGHT = 0.5;
export const TOP_DEPTH = 0.95;

import { Trapezoid } from "../surfaces/trapezoid.js";
import { Model } from "../model.js";
import { generateSweepSurface } from "../surface-generator.js";

export function getChasis(gl, glMatrix) {
	let level0Matrix = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	);
	
	let level1MatrixBase = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,BASE_DEPTH,1
	);

	const baseTrapezoid = new Trapezoid(BASE_BASE_WIDTH, BASE_TOP_WIDTH, BASE_HEIGHT);
	const baseTrapezoidArrays = baseTrapezoid.getPositionAndNormalArrays();
	const carBaseBuffers = generateSweepSurface(
		gl,
		glMatrix,
		baseTrapezoidArrays.positionArray,
		baseTrapezoidArrays.normalArray,
		[level0Matrix, level1MatrixBase],
	);
	const carBase = new Model(
		carBaseBuffers.glPositionBuffer,
		carBaseBuffers.glNormalBuffer,
		carBaseBuffers.glIndexBuffer
	);

	let level1MatrixTop = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,TOP_DEPTH,1
	);

	const topTrapezoid = new Trapezoid(TOP_BASE_WIDTH, TOP_TOP_WIDTH, TOP_HEIGHT);
	const topTrapezoidArrays = topTrapezoid.getPositionAndNormalArrays();
	const carTopBuffers = generateSweepSurface(
		gl,
		glMatrix,
		topTrapezoidArrays.positionArray,
		topTrapezoidArrays.normalArray,
		[level0Matrix, level1MatrixTop],
	);
	const carTop = new Model(
		carTopBuffers.glPositionBuffer,
		carTopBuffers.glNormalBuffer,
		carTopBuffers.glIndexBuffer
	);

	carTop.translationVector = [0, BASE_HEIGHT / 2 + TOP_HEIGHT / 2, 0];

	const carChasis = new Model();
	carChasis.addChild(carBase);
	carChasis.addChild(carTop);
	return carChasis;
}