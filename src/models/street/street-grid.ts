import { getStreetBuffers } from './street'
import { getIntersectionBuffers } from './intersection'
import { Model } from '../model'
import { getGlBuffersFromBuffers } from '../../gl/gl-buffers'
import { BLOCK_SIDE, BLOCK_CORNER_RADIUS } from '../block/sidewalk'
import { TextureMap } from '../../texture-map'

const STREET_WIDTH = 10

function getLanesBuffers() {
    const positionBuffer: number[] = []
    const normalBuffer: number[] = []
    const uvBuffer: number[] = []
    const indexBuffer: number[] = []
    let indexBufferOffset = 0
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            const x = -165 + 110 * i
            const y = -220 + 110 * j
            const verticalStreetBuffers = getStreetBuffers(
                STREET_WIDTH,
                BLOCK_SIDE - 2 * BLOCK_CORNER_RADIUS,
                x,
                y,
                false,
                8,
                indexBufferOffset
            )
            positionBuffer.push(...verticalStreetBuffers.positionBuffer)
            normalBuffer.push(...verticalStreetBuffers.normalBuffer)
            uvBuffer.push(...verticalStreetBuffers.uvBuffer)
            indexBuffer.push(...verticalStreetBuffers.indexBuffer)
            indexBufferOffset += 6

            const horizontalStreetBuffers = getStreetBuffers(
                STREET_WIDTH,
                BLOCK_SIDE - 2 * BLOCK_CORNER_RADIUS,
                y,
                x,
                true,
                8,
                indexBufferOffset
            )
            positionBuffer.push(...horizontalStreetBuffers.positionBuffer)
            normalBuffer.push(...horizontalStreetBuffers.normalBuffer)
            uvBuffer.push(...horizontalStreetBuffers.uvBuffer)
            indexBuffer.push(...horizontalStreetBuffers.indexBuffer)
            indexBufferOffset += 6
        }
    }
    return {
        positionBuffer,
        normalBuffer,
        uvBuffer,
        indexBuffer,
        indexBufferOffset,
    }
}

function getIntersectionsBuffers(indexBufferOffset: number) {
    const positionBuffer: number[] = []
    const normalBuffer: number[] = []
    const uvBuffer: number[] = []
    const indexBuffer: number[] = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const x = -165 + 110 * i
            const y = -165 + 110 * j
            const intersectionBuffers = getIntersectionBuffers(
                2 * BLOCK_CORNER_RADIUS + STREET_WIDTH,
                x,
                y,
                indexBufferOffset
            )
            positionBuffer.push(...intersectionBuffers.positionBuffer)
            normalBuffer.push(...intersectionBuffers.normalBuffer)
            uvBuffer.push(...intersectionBuffers.uvBuffer)
            indexBuffer.push(...intersectionBuffers.indexBuffer)
            indexBufferOffset += 6
        }
    }
    return { positionBuffer, normalBuffer, uvBuffer, indexBuffer }
}

export function getStreetGrid(
    gl: WebGLRenderingContext,
    textureMap: TextureMap
) {
    const positionBuffer: number[] = []
    const normalBuffer: number[] = []
    const uvBuffer: number[] = []
    const indexBuffer: number[] = []
    const lanesBuffers = getLanesBuffers()
    const intersectionsBuffers = getIntersectionsBuffers(
        lanesBuffers.indexBufferOffset
    )
    positionBuffer.push(
        ...lanesBuffers.positionBuffer,
        ...intersectionsBuffers.positionBuffer
    )
    normalBuffer.push(
        ...lanesBuffers.normalBuffer,
        ...intersectionsBuffers.normalBuffer
    )
    uvBuffer.push(...lanesBuffers.uvBuffer, ...intersectionsBuffers.uvBuffer)
    indexBuffer.push(
        ...lanesBuffers.indexBuffer,
        ...intersectionsBuffers.indexBuffer
    )
    const glBuffers = getGlBuffersFromBuffers(
        gl,
        positionBuffer,
        normalBuffer,
        uvBuffer,
        indexBuffer
    )
    return new Model(
        gl.TRIANGLES,
        glBuffers.glPositionBuffer,
        glBuffers.glNormalBuffer,
        glBuffers.glIndexBuffer,
        glBuffers.glUVBuffer,
        textureMap.getTexture('street')
    )
}
