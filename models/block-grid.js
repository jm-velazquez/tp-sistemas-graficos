import { getBlock, getBuildingBlockHeights } from "./block.js";
import { BLOCK_SIDE } from "./sidewalk.js";
import { Model } from "../model.js";

const STREET_WIDTH = 10;

export function getBuildingBlockHeightsPerBlock() {
	const buildingBlockHeightsPerBlock = [];
	for (let i = 0; i < 25; i++) {
		buildingBlockHeightsPerBlock.push(getBuildingBlockHeights());
	}
	return buildingBlockHeightsPerBlock;
}

export function getBlockGrid(gl, glMatrix, buildingHeightsPerBlock) {
	const blockGrid = new Model();
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			const block = getBlock(gl, glMatrix, buildingHeightsPerBlock[i + j * 5]);
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