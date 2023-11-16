import { generateRevolutionSurface, generateSweepSurface } from "../surface-generator.js";
import { Model } from "../model.js";
import { Circle } from "../shapes/circle.js";
import { QuarterCircle } from "../shapes/quarter-circle.js";

function getPillar(gl, glMatrix, columnHeight) {
	const level0Matrix = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	);

	const level1Matrix = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,columnHeight,1
	);
	
	const pillarShape = new Circle(8);
	const pillarArrays = pillarShape.getPositionAndNormalArrays(20);
	const pillarBuffers = generateSweepSurface(
		gl,
		glMatrix,
		pillarArrays.positionArray,
		pillarArrays.normalArray,
		[level0Matrix, level1Matrix],
		false, false
	);
	return new Model(
		gl.TRIANGLE_STRIP,
		pillarBuffers.glPositionBuffer,
		pillarBuffers.glNormalBuffer,
		pillarBuffers.glIndexBuffer,
	);
}

function getBase(gl, glMatrix) {
	const baseShape = new QuarterCircle(12);
	const baseArrays = baseShape.getPositionAndNormalArrays(5);
	const baseBuffers = generateRevolutionSurface(
		gl,
		glMatrix,
		baseArrays.positionArray,
		baseArrays.normalArray,
		20, true, true,
	);
	return new Model(
		gl.TRIANGLE_STRIP,
		baseBuffers.glPositionBuffer,
		baseBuffers.glNormalBuffer,
		baseBuffers.glIndexBuffer,
	);
}

export function getColumn(gl, glMatrix, columnHeight) {
	const pillar = getPillar(gl, glMatrix, columnHeight);
	const base = getBase(gl, glMatrix);
	base.rotationAxis = [1,0,0];
	base.rotationDegree = - Math.PI / 2;
	base.translationVector = [0,0, columnHeight];
	pillar.addChild(base);
	pillar.rotationAxis = [1,0,0];
	pillar.rotationDegree = Math.PI / 2;
	return pillar;
}
