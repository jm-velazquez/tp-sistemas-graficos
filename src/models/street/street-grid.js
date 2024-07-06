import { getStreetBuffers } from './street.js'
import { getIntersectionBuffers } from './intersection.js'
import { Model } from '../model.js'
import { getGlBuffersFromBuffers } from '../../gl/gl-buffers.js'
import { BLOCK_SIDE, BLOCK_CORNER_RADIUS } from '../block/sidewalk.js'

const STREET_WIDTH = 10

function getLanesBuffers() {
    const buffers = {
        positionBuffer: [],
        normalBuffer: [],
        uvBuffer: [],
        indexBuffer: [],
        indexBufferOffset: 0,
    }
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
                buffers.indexBufferOffset
            )
            buffers.positionBuffer.push(...verticalStreetBuffers.positionBuffer)
            buffers.normalBuffer.push(...verticalStreetBuffers.normalBuffer)
            buffers.uvBuffer.push(...verticalStreetBuffers.uvBuffer)
            buffers.indexBuffer.push(...verticalStreetBuffers.indexBuffer)
            buffers.indexBufferOffset += 6

            const horizontalStreetBuffers = getStreetBuffers(
                STREET_WIDTH,
                BLOCK_SIDE - 2 * BLOCK_CORNER_RADIUS,
                y,
                x,
                true,
                8,
                buffers.indexBufferOffset
            )
            buffers.positionBuffer.push(
                ...horizontalStreetBuffers.positionBuffer
            )
            buffers.normalBuffer.push(...horizontalStreetBuffers.normalBuffer)
            buffers.uvBuffer.push(...horizontalStreetBuffers.uvBuffer)
            buffers.indexBuffer.push(...horizontalStreetBuffers.indexBuffer)
            buffers.indexBufferOffset += 6
        }
    }
    return buffers
}

function getIntersectionsBuffers(indexBufferOffset) {
    const buffers = {
        positionBuffer: [],
        normalBuffer: [],
        uvBuffer: [],
        indexBuffer: [],
    }
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
            buffers.positionBuffer.push(...intersectionBuffers.positionBuffer)
            buffers.normalBuffer.push(...intersectionBuffers.normalBuffer)
            buffers.uvBuffer.push(...intersectionBuffers.uvBuffer)
            buffers.indexBuffer.push(...intersectionBuffers.indexBuffer)
            indexBufferOffset += 6
        }
    }
    return buffers
}

export function getStreetGrid(gl, textureMap) {
    const buffers = {
        positionBuffer: [],
        normalBuffer: [],
        uvBuffer: [],
        indexBuffer: [],
    }
    const lanesBuffers = getLanesBuffers()
    const intersectionsBuffers = getIntersectionsBuffers(
        lanesBuffers.indexBufferOffset
    )
    buffers.positionBuffer.push(
        ...lanesBuffers.positionBuffer,
        ...intersectionsBuffers.positionBuffer
    )
    buffers.normalBuffer.push(
        ...lanesBuffers.normalBuffer,
        ...intersectionsBuffers.normalBuffer
    )
    buffers.uvBuffer.push(
        ...lanesBuffers.uvBuffer,
        ...intersectionsBuffers.uvBuffer
    )
    buffers.indexBuffer.push(
        ...lanesBuffers.indexBuffer,
        ...intersectionsBuffers.indexBuffer
    )
    const glBuffers = getGlBuffersFromBuffers(
        gl,
        buffers.positionBuffer,
        buffers.normalBuffer,
        buffers.uvBuffer,
        buffers.indexBuffer
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
