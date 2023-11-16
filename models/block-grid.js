import { getBlock, getBuildingBlockHeights } from "./block.js";
import { BLOCK_SIDE } from "./sidewalk.js";
import { Model } from "../model.js";

const STREET_WIDTH = 10;

function distance2(a, b) {
	return Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2);
}

export function getEmptyGrids(levels) {
	const blockCenters = [
		[-220, 220], [-220, 110], [-220, 0], [-220, -110], [-220, -220],
		[-110, 220], [-110, 110], [-110, 0], [-110, -110], [-110, -220],
		[0, 220], [0, 110], [0, 0], [0, -110], [0, -220],
		[110, 220], [110, 110], [110, 0], [110, -110], [110, -220],
		[220, 220], [220, 110], [220, 0], [220, -110], [220, -220]
	];
	const emptyGrids = Array(25).fill(false);
	levels.map(level => {
		const distanceFromCenters = blockCenters.map(blockCenter => distance2(blockCenter, level));
		const minDistanceFromCenters = Math.min(...distanceFromCenters);
		if (minDistanceFromCenters < 7500) {
			const emptyGridIndex = distanceFromCenters.indexOf(Math.min(...distanceFromCenters));
			emptyGrids[emptyGridIndex] = true;
		}
	});
	return emptyGrids;
}

export function getBuildingBlockHeightsPerBlock() {
	const buildingBlockHeightsPerBlock = [];
	for (let i = 0; i < 25; i++) {
		buildingBlockHeightsPerBlock.push(getBuildingBlockHeights());
	}
	return buildingBlockHeightsPerBlock;
}

export function getBlockGrid(gl, glMatrix, buildingHeightsPerBlock, emptyGrids) {
	const blockGrid = new Model();
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			const block = getBlock(gl, glMatrix, buildingHeightsPerBlock[i + j * 5], emptyGrids[i + j * 5]);
			block.translationVector = [
				(BLOCK_SIDE + STREET_WIDTH) * (j - 2),
				(BLOCK_SIDE + STREET_WIDTH) * (i - 2),
				0
			];
			blockGrid.addChild(block);
		}
	}
	return blockGrid;
}