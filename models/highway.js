import { generateLevelMatrices, translateMatricesAlongNormalAxis } from "../curves/level-matrix-generator.js";
import { Rectangle } from "../shapes/rectangle.js";
import { Trapezoid } from "../shapes/trapezoid.js";
import { generateSweepSurface } from "../surface-generator.js";
import { Model } from "../model.js";
import { LUT } from "../curves/look-up-table.js";
import { getStreetLight } from "./street-light.js";
import { getColumn } from "./column.js";
import { getCar } from "../models/car.js";

const ROAD_WIDTH = 50;
const ROAD_HEIGHT = 4;

function getLights(gl, glMatrix, levelMatrices, amountOfLights) {
	const levels = levelMatrices.map(levelMatrix => [levelMatrix[12], levelMatrix[14]]);
	const lut = new LUT(levels);
	const distance = lut.getTotalDistance() / (amountOfLights - 1);
	
	const streetLights = [];
	for (let i = 0; i < amountOfLights; i++) {
		const streetLight = getStreetLight(gl, glMatrix);
		const position = lut.getInterpolatedPoint(distance * i);
		
		// Get normal of the closest past level
		const index = lut.getClosestPointAndIndex(distance * i)[1];
		const levelMatrix = levelMatrices[index];
		const normal = [levelMatrix[0], levelMatrix[1], levelMatrix[2]];
		
		const isEven = i % 2 === 0;
		streetLight.rotationAxis = [0,1,0];
		streetLight.rotationDegree = glMatrix.vec3.angle(normal, [0,0,1]) + Math.PI / 2 + isEven * Math.PI;
		streetLight.translationVector = [position[0], 2, position[1]];
		streetLights.push(streetLight);
	}
	return streetLights;
}

function getColumns(gl, glMatrix, levels, amountOfColumns) {
	const lut = new LUT(levels);
	const distance = lut.getTotalDistance() / (amountOfColumns - 1);
	
	const columns = [];
	for (let i = 0; i < amountOfColumns; i++) {
		const column = getColumn(gl, glMatrix, 30);
		const position = lut.getInterpolatedPoint(distance * i);
		column.translationVector = [position[0], 0, position[1]];
		columns.push(column);
	}
	return columns;
}

function getRoad(gl, glMatrix, levelMatrices) {
	const roadShape = new Rectangle(ROAD_WIDTH, ROAD_HEIGHT);
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

	return new Model(
		gl.TRIANGLE_STRIP,
		roadBuffers.glPositionBuffer,
		roadBuffers.glNormalBuffer,
		roadBuffers.glIndexBuffer,
	);
}

function getGuardrail(gl, glMatrix, levelMatrices) {
	const guardrailShape = new Trapezoid(1,0.5,1);
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
	guardrail.translationVector = [0, 2.5, 0];
	return guardrail;
}

function getCars(gl, glMatrix, carPositions) {
	const carsPositionsAndAngles = carPositions.getNewPositionsAndRotationAngles(glMatrix);
	const cars = [];
	for (let i = 0; i < carsPositionsAndAngles.length; i++) {
		const [position, angle] = carsPositionsAndAngles[i];
		const car = getCar(gl, glMatrix);
		car.rotationAxis = [1,0,0];
		car.rotationDegree = angle;
		car.translationVector = position;
	}
	return cars;
}

export function getHighway(gl, glMatrix, levels, amountOfLights, amountOfColumns, carPositions) {
	const levelMatrices = generateLevelMatrices(glMatrix, levels);
	
	const road = getRoad(gl, glMatrix, levelMatrices);

	const middleGuardrail = getGuardrail(gl, glMatrix, levelMatrices);
	road.addChild(middleGuardrail);

	const rightGuardrailMatrices = translateMatricesAlongNormalAxis(glMatrix, levelMatrices, ROAD_WIDTH / 2);
	const rightGuardrail = getGuardrail(gl, glMatrix, rightGuardrailMatrices);
	road.addChild(rightGuardrail);

	const leftGuardrailMatrices = translateMatricesAlongNormalAxis(glMatrix, levelMatrices, - ROAD_WIDTH / 2);
	const leftGuardrail = getGuardrail(gl, glMatrix, leftGuardrailMatrices);
	road.addChild(leftGuardrail);

	const streetLights = getLights(gl, glMatrix, levelMatrices, amountOfLights);
	streetLights.forEach(streetLight => road.addChild(streetLight));
	
	const columns = getColumns(gl, glMatrix, levels, amountOfColumns);
	columns.forEach(column => road.addChild(column));

	const cars = getCars(gl, glMatrix, carPositions);
	cars.forEach(car => road.addChild(car));

	return road;
}
