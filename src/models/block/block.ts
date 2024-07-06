import {
    BuildingVariation,
    MAX_BUILDING_STORIES,
    STORY_HEIGHT,
    getBuildingBuffers,
} from './building'
import { getSidewalk, SIDEWALK_HEIGHT } from './sidewalk'
import { getGlBuffersFromBuffers } from '../../gl/gl-buffers'
import { Model } from '../model'
import { TextureMap } from '../../texture-map'

const INDEX_BUFFER_OFFSET = 24
const BUILDINGS_PER_BLOCK = 12
const BUILDING_VARIATIONS = 4

export function getBuildingBlockHeights() {
    const buildingHeights = []
    for (let i = 0; i < BUILDINGS_PER_BLOCK; i++) {
        buildingHeights.push(
            Math.floor(Math.random() * (MAX_BUILDING_STORIES - 1)) *
                STORY_HEIGHT +
                STORY_HEIGHT
        )
    }
    return buildingHeights
}

export function getBuildingBlockVariations(): BuildingVariation[] {
    const buildingVariations: BuildingVariation[] = []
    for (let i = 0; i < BUILDINGS_PER_BLOCK; i++) {
        buildingVariations.push(
            Math.floor(Math.random() * BUILDING_VARIATIONS) as BuildingVariation
        )
    }
    return buildingVariations
}

function getAllBuildingBuffers(
    buildingHeights: number[],
    buildingVariations: BuildingVariation[]
) {
    const xyOffsets = [
        [-40, -40],
        [-20, -40],
        [0, -40],
        [20, -40],
        [20, -20],
        [20, 0],
        [20, 20],
        [0, 20],
        [-20, 20],
        [-40, 20],
        [-40, 0],
        [-40, -20],
    ]
    const buildingBuffers = xyOffsets.map((offset, index) =>
        getBuildingBuffers(
            buildingHeights[index],
            buildingVariations[index],
            offset[0],
            offset[1],
            SIDEWALK_HEIGHT,
            index * INDEX_BUFFER_OFFSET
        )
    )
    const positionBuffer: number[] = []
    const normalBuffer: number[] = []
    const uvBuffer: number[] = []
    const indexBuffer: number[] = []
    buildingBuffers.forEach((buffers) => {
        positionBuffer.push(...buffers.positionBuffer)
        normalBuffer.push(...buffers.normalBuffer)
        uvBuffer.push(...buffers.uvBuffer)
        indexBuffer.push(...buffers.indexBuffer)
    })
    return { positionBuffer, normalBuffer, uvBuffer, indexBuffer }
}

export function getBlock(
    gl: WebGLRenderingContext,
    textureMap: TextureMap,
    buildingHeights: number[],
    buildingVariations: BuildingVariation[],
    isEmpty: boolean
) {
    if (isEmpty) {
        const sidewalk = getSidewalk(gl, textureMap.getTexture('grass'))
        return sidewalk
    }
    const allBuildingBuffers = getAllBuildingBuffers(
        buildingHeights,
        buildingVariations
    )
    const glBlockBuffers = getGlBuffersFromBuffers(
        gl,
        allBuildingBuffers.positionBuffer,
        allBuildingBuffers.normalBuffer,
        allBuildingBuffers.uvBuffer,
        allBuildingBuffers.indexBuffer
    )
    const buildings = new Model(
        gl.TRIANGLES,
        glBlockBuffers.glPositionBuffer,
        glBlockBuffers.glNormalBuffer,
        glBlockBuffers.glIndexBuffer,
        glBlockBuffers.glUVBuffer,
        textureMap.getTexture('buildings')
    )
    const sidewalk = getSidewalk(gl, textureMap.getTexture('sidewalk'))
    sidewalk.addChild(buildings)
    return sidewalk
}
