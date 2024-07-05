import {
  getBlock,
  getBuildingBlockHeights,
  getBuildingBlockVariations,
} from "./block.js";
import { BLOCK_SIDE } from "./sidewalk.js";
import { Model } from "../model.js";

const STREET_WIDTH = 10;
const MAXIMUM_DISTANCE_HIGHWAY_PARK2 = 7000;

function distance2(a, b) {
  return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);
}

export function getEmptyGrids(levels) {
  const blockCenters = [
    [-220, 220],
    [-220, 110],
    [-220, 0],
    [-220, -110],
    [-220, -220],
    [-110, 220],
    [-110, 110],
    [-110, 0],
    [-110, -110],
    [-110, -220],
    [0, 220],
    [0, 110],
    [0, 0],
    [0, -110],
    [0, -220],
    [110, 220],
    [110, 110],
    [110, 0],
    [110, -110],
    [110, -220],
    [220, 220],
    [220, 110],
    [220, 0],
    [220, -110],
    [220, -220],
  ];
  let emptyBlocks = Array(25).fill(false);
  levels.map((level) => {
    const distanceFromCenters = blockCenters.map((blockCenter) =>
      distance2(blockCenter, level),
    );
    const emptyBlockIndexes = distanceFromCenters.map(
      (distance) => distance < MAXIMUM_DISTANCE_HIGHWAY_PARK2,
    );
    emptyBlocks = emptyBlocks.map(
      (isCurrentlyEmpty, i) => isCurrentlyEmpty || emptyBlockIndexes[i],
    );
  });
  return emptyBlocks;
}

export function getBuildingBlockHeightsPerBlock() {
  const buildingBlockHeightsPerBlock = [];
  for (let i = 0; i < 25; i++) {
    buildingBlockHeightsPerBlock.push(getBuildingBlockHeights());
  }
  return buildingBlockHeightsPerBlock;
}

export function getBuildingVariationsPerBlock() {
  const buildingVariationsPerBlock = [];
  for (let i = 0; i < 25; i++) {
    buildingVariationsPerBlock.push(getBuildingBlockVariations());
  }
  return buildingVariationsPerBlock;
}

export function getBlockGrid(
  gl,
  glMatrix,
  textureMap,
  buildingHeightsPerBlock,
  buildingVariationsPerBlock,
  emptyGrids,
) {
  const blockGrid = new Model();
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const block = getBlock(
        gl,
        glMatrix,
        textureMap,
        buildingHeightsPerBlock[i + j * 5],
        buildingVariationsPerBlock[i + j * 5],
        emptyGrids[i + j * 5],
      );
      block.translationVector = [
        (BLOCK_SIDE + STREET_WIDTH) * (j - 2),
        (BLOCK_SIDE + STREET_WIDTH) * (i - 2),
        0,
      ];
      blockGrid.addChild(block);
    }
  }
  return blockGrid;
}
