import { generateRevolutionSurface, generateSweepSurface } from "../../surface-generator.js";
import { Model } from "../model.js";
import { Circle } from "../../shapes/circle.js";
import { QuarterCircle } from "../../shapes/quarter-circle.js";

function getPillar(gl, glMatrix, texture, columnHeight) {
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
	
	const pillarShape = new Circle(8, 16);
	const pillarBuffers = generateSweepSurface(
		gl,
		glMatrix,
		pillarShape,
		[level0Matrix, level1Matrix],
		false,
		false,
		2,
	);
	return new Model(
		gl.TRIANGLE_STRIP,
		pillarBuffers.glPositionBuffer,
		pillarBuffers.glNormalBuffer,
		pillarBuffers.glIndexBuffer,
		pillarBuffers.glUVBuffer,
		texture,
	);
}

function getBase(gl, glMatrix, texture) {
	const baseShape = new QuarterCircle(12);
	const baseBuffers = generateRevolutionSurface(
		gl,
		glMatrix,
		baseShape,
		20,
		true,
		true,
	);
	return new Model(
		gl.TRIANGLE_STRIP,
		baseBuffers.glPositionBuffer,
		baseBuffers.glNormalBuffer,
		baseBuffers.glIndexBuffer,
		baseBuffers.glUVBuffer,
		texture,
	);
}

export function getColumn(gl, glMatrix, pillarTexture, baseTexture, columnHeight) {
	const pillar = getPillar(gl, glMatrix, pillarTexture, columnHeight);
	const base = getBase(gl, glMatrix, baseTexture);
	base.rotationAxis = [1,0,0];
	base.rotationDegree = - Math.PI / 2;
	base.translationVector = [0,0, columnHeight];
	pillar.addChild(base);
	pillar.rotationAxis = [1,0,0];
	pillar.rotationDegree = Math.PI / 2;
	return pillar;
}
