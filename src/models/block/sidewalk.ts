import { mat4 } from 'gl-matrix'
import { Squircle } from '../../shapes/squircle'
import { Model } from '../model'
import { generateSweepSurface } from '../../surface-generator'

export const SIDEWALK_HEIGHT = 0.2
export const BLOCK_SIDE = 100
export const BLOCK_CORNER_RADIUS = 10

export function getSidewalk(gl: WebGLRenderingContext, texture: WebGLTexture) {
    const level0Matrix = mat4.fromValues(
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
    )

    const level1Matrix = mat4.fromValues(
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        SIDEWALK_HEIGHT,
        1
    )
    const squircle = new Squircle(BLOCK_SIDE, BLOCK_CORNER_RADIUS, 10)
    const sidewalkBuffers = generateSweepSurface(
        gl,
        squircle,
        [level0Matrix, level1Matrix],
        false,
        true
    )
    return new Model(
        gl.TRIANGLE_STRIP,
        sidewalkBuffers.glPositionBuffer,
        sidewalkBuffers.glNormalBuffer,
        sidewalkBuffers.glIndexBuffer,
        sidewalkBuffers.glUVBuffer,
        texture
    )
}
