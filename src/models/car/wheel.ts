export const WHEEL_DEPTH = 0.2
export const RADIUS = 0.25
const DEFINITION = 20

import { mat4 } from 'gl-matrix'
import { Circle } from '../../shapes/circle'
import { Model } from '../model'
import { generateSweepSurface } from '../../surface-generator'

export function getWheel(
    gl: WebGLRenderingContext,
    texture: WebGLTexture
): Model {
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
        WHEEL_DEPTH,
        1
    )

    const circle = new Circle(RADIUS, DEFINITION)
    const cylinderBuffers = generateSweepSurface(
        gl,
        circle,
        [level0Matrix, level1Matrix],
        true,
        true
    )
    return new Model(
        gl.TRIANGLE_STRIP,
        cylinderBuffers.glPositionBuffer,
        cylinderBuffers.glNormalBuffer,
        cylinderBuffers.glIndexBuffer,
        cylinderBuffers.glUVBuffer,
        texture
    )
}
