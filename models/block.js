import { getBuildingBuffers } from "./building.js";
import { getSidewalk, SIDEWALK_HEIGHT } from "./sidewalk.js";
import { getGlBuffersFromBuffers } from "../gl/gl-buffers.js";
import { Model } from "../model.js";

const MAX_BUILDING_HEIGHT = 100;
const MIN_BUILDING_HEIGHT = 20;
const BUILDING_SIDE = 20;
const INDEX_BUFFER_OFFSET = 24;
const BUILDINGS_PER_BLOCK = 12;

export function getBuildingBlockHeights() {
	const buildingHeights = [];
	for (let i = 0; i < BUILDINGS_PER_BLOCK; i++) {
		buildingHeights.push(Math.random() * (MAX_BUILDING_HEIGHT - MIN_BUILDING_HEIGHT) + MIN_BUILDING_HEIGHT);
	}
	return buildingHeights;
}

function getAllBuildingBuffers(gl, buildingHeights) {
	const xyOffsets = [
		[-40, -40],
		[-20, -40],
		[  0, -40],
		[ 20, -40],
		[ 20, -20],
		[ 20,   0],
		[ 20,  20],
		[  0,  20],
		[-20,  20],
		[-40,  20],
		[-40,   0],
		[-40, -20],
	];
	const buildingBuffers = xyOffsets.map(
		(offset, index) => getBuildingBuffers(
			gl,
			BUILDING_SIDE,
			BUILDING_SIDE,
			buildingHeights[index],
			offset[0],
			offset[1],
			SIDEWALK_HEIGHT,
			index * INDEX_BUFFER_OFFSET
		)
	);
	const allBuildingBuffers = {positionBuffer: [], normalBuffer: [], indexBuffer: []};
	buildingBuffers.forEach(buffers => {
		allBuildingBuffers.positionBuffer.push(...buffers.positionBuffer);
		allBuildingBuffers.normalBuffer.push(...buffers.normalBuffer);
		allBuildingBuffers.indexBuffer.push(...buffers.indexBuffer);
	});
	return allBuildingBuffers;
}

export function getBlock(gl, glMatrix, buildingHeights) {
	const allBuildingBuffers = getAllBuildingBuffers(gl, buildingHeights);
	const glBlockBuffers = getGlBuffersFromBuffers(
		gl,
		allBuildingBuffers.positionBuffer,
		allBuildingBuffers.normalBuffer,
		[],
		allBuildingBuffers.indexBuffer
	);
	const buildings = new Model(
		gl.TRIANGLES,
		glBlockBuffers.glPositionBuffer,
		glBlockBuffers.glNormalBuffer,
		glBlockBuffers.glIndexBuffer
	)
	const sidewalk = getSidewalk(gl, glMatrix);
	sidewalk.addChild(buildings);

	return sidewalk;
}