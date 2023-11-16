import { Bezier2 } from "../curves/bezier.js";
import { Model } from "../model.js";
import { Circle } from "../shapes/circle.js";
import { Trapezoid } from "../shapes/trapezoid.js";
import { generateLevelMatrices } from "../curves/level-matrix-generator.js";
import { generateSweepSurface } from "../surface-generator.js";


const POLE_RADIUS = 0.2;
const STREET_LIGHT_HEIGHT = 20;
const POLE_CURVE_RADIUS = 10;

const LIGHTBULB_WIDTH = 1;
const LIGHTBULB_BASE = 3;
const LIGHTBULB_TOP = 2;
const LIGHTBULB_HEIGHT = 0.3;

function getLightbulb(gl, glMatrix) {
	const lightbulbShape = new Trapezoid(LIGHTBULB_BASE, LIGHTBULB_TOP, LIGHTBULB_HEIGHT);
	const lightbulbArrays = lightbulbShape.getPositionAndNormalArrays();
	const levelMatrix1 = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1,
	);
	const levelMatrix2 = glMatrix.mat4.fromValues(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,LIGHTBULB_WIDTH,1,
	);
	const lightbulbBuffers = generateSweepSurface(
		gl,
		glMatrix,
		lightbulbArrays.positionArray,
		lightbulbArrays.normalArray,
		[levelMatrix1, levelMatrix2],
		true, true,
	);
	const lightbulb = new Model(
		gl.TRIANGLE_STRIP,
		lightbulbBuffers.glPositionBuffer,
		lightbulbBuffers.glNormalBuffer,
		lightbulbBuffers.glIndexBuffer,
	);
	lightbulb.translationVector = [POLE_CURVE_RADIUS, STREET_LIGHT_HEIGHT - POLE_RADIUS, - LIGHTBULB_WIDTH / 2];
	return lightbulb;
}

function getPole(gl, glMatrix) {
	const poleShape = new Circle(POLE_RADIUS);
	const poleArrays = poleShape.getPositionAndNormalArrays(10);
	const bezierCurve = new Bezier2();
	bezierCurve.setControlPoints(
		[
			[0,0],
			[0,0],
			[0,STREET_LIGHT_HEIGHT - POLE_CURVE_RADIUS],
			[0,STREET_LIGHT_HEIGHT - POLE_CURVE_RADIUS],
			[0, STREET_LIGHT_HEIGHT],
			[POLE_CURVE_RADIUS, STREET_LIGHT_HEIGHT],
			[POLE_CURVE_RADIUS, STREET_LIGHT_HEIGHT],
		]
	);
	const levels = bezierCurve.getPolygon();
	const levelMatrices = generateLevelMatrices(glMatrix, levels);
	const poleBuffers = generateSweepSurface(
		gl,
		glMatrix,
		poleArrays.positionArray,
		poleArrays.normalArray,
		levelMatrices,
		false, true
	);
	const pole = new Model(
		gl.TRIANGLE_STRIP,
		poleBuffers.glPositionBuffer,
		poleBuffers.glNormalBuffer,
		poleBuffers.glIndexBuffer
	);
	pole.rotationAxis = [1, 0, 0];
	pole.rotationDegree = - Math.PI / 2;
	return pole;
}

export function getStreetLight(gl, glMatrix) {
	const lightbulb = getLightbulb(gl, glMatrix);
	const pole = getPole(gl, glMatrix);
	const streetLight = new Model();
	streetLight.addChild(lightbulb);
	streetLight.addChild(pole);
	return streetLight;
}