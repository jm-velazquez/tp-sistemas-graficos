import { getBuildingBuffers } from "./building.js";
import { getSidewalk, SIDEWALK_HEIGHT } from "./sidewalk.js";
import { getGlBuffersFromBuffers } from "../gl/gl-buffers.js";
import { Model } from "../model.js";

const MAX_BUILDING_STORIES = 8;
const STORY_HEIGHT = 10;
const BUILDING_SIDE = 20;
const INDEX_BUFFER_OFFSET = 24;
const BUILDINGS_PER_BLOCK = 12;

export function getBuildingBlockHeights() {
	const buildingHeights = [];
	for (let i = 0; i < BUILDINGS_PER_BLOCK; i++) {
		buildingHeights.push(Math.floor(Math.random() * (MAX_BUILDING_STORIES - 1)) * STORY_HEIGHT + STORY_HEIGHT);
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
	const allBuildingBuffers = {positionBuffer: [], normalBuffer: [], uvBuffer: [], indexBuffer: []};
	buildingBuffers.forEach(buffers => {
		allBuildingBuffers.positionBuffer.push(...buffers.positionBuffer);
		allBuildingBuffers.normalBuffer.push(...buffers.normalBuffer);
		allBuildingBuffers.uvBuffer.push(...buffers.uvBuffer);
		allBuildingBuffers.indexBuffer.push(...buffers.indexBuffer);
	});
	return allBuildingBuffers;
}

export function getBlock(gl, glMatrix, buildingHeights, empty) {
	const allBuildingBuffers = getAllBuildingBuffers(gl, buildingHeights);
	const glBlockBuffers = getGlBuffersFromBuffers(
		gl,
		allBuildingBuffers.positionBuffer,
		allBuildingBuffers.normalBuffer,
		allBuildingBuffers.uvBuffer,
		allBuildingBuffers.indexBuffer
	);
	const buildings = new Model(
		gl.TRIANGLES,
		glBlockBuffers.glPositionBuffer,
		glBlockBuffers.glNormalBuffer,
		glBlockBuffers.glIndexBuffer,
		glBlockBuffers.glUVBuffer,
	);
	const sidewalk = getSidewalk(gl, glMatrix);
	if (!empty) {
		sidewalk.addChild(buildings);
	}
	return sidewalk;
}