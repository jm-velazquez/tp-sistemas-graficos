import {
    getBlock,
    getBuildingBlockHeights,
    getBuildingBlockVariations,
} from './block'
import { BLOCK_SIDE } from './sidewalk'
import { Model } from '../model'
import { TextureMap } from '../../texture-map'
import { BuildingVariation } from './building'

const STREET_WIDTH = 10
const MAXIMUM_DISTANCE_HIGHWAY_PARK2 = 7000

function distance2(a: number[], b: number[]) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)
}

export function getEmptyGrids(levels: number[][]) {
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
    ]
    let emptyBlocks: boolean[] = Array(25).fill(false)
    levels.map((level) => {
        const distanceFromCenters = blockCenters.map((blockCenter) =>
            distance2(blockCenter, level)
        )
        const emptyBlockIndexes = distanceFromCenters.map(
            (distance) => distance < MAXIMUM_DISTANCE_HIGHWAY_PARK2
        )
        emptyBlocks = emptyBlocks.map(
            (isCurrentlyEmpty, i) => isCurrentlyEmpty || emptyBlockIndexes[i]
        )
    })
    return emptyBlocks
}

export function getBuildingBlockHeightsPerBlock() {
    const buildingBlockHeightsPerBlock: number[][] = []
    for (let i = 0; i < 25; i++) {
        buildingBlockHeightsPerBlock.push(getBuildingBlockHeights())
    }
    return buildingBlockHeightsPerBlock
}

export function getBuildingVariationsPerBlock() {
    const buildingVariationsPerBlock: BuildingVariation[][] = []
    for (let i = 0; i < 25; i++) {
        buildingVariationsPerBlock.push(getBuildingBlockVariations())
    }
    return buildingVariationsPerBlock
}

export function getBlockGrid(
    gl: WebGLRenderingContext,
    textureMap: TextureMap,
    buildingHeightsPerBlock: number[][],
    buildingVariationsPerBlock: BuildingVariation[][],
    emptyGrids: boolean[]
) {
    const blockGrid = new Model()
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const block = getBlock(
                gl,
                textureMap,
                buildingHeightsPerBlock[i + j * 5],
                buildingVariationsPerBlock[i + j * 5],
                emptyGrids[i + j * 5]
            )
            block.translationVector = [
                (BLOCK_SIDE + STREET_WIDTH) * (j - 2),
                (BLOCK_SIDE + STREET_WIDTH) * (i - 2),
                0,
            ]
            blockGrid.addChild(block)
        }
    }
    return blockGrid
}
