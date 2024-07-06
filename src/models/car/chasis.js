import { mat4 } from 'gl-matrix'
import { Trapezoid } from '../../shapes/trapezoid.js'
import { Model } from '../model.js'
import { generateSweepSurface } from '../../surface-generator.js'

export const BASE_BASE_WIDTH = 3
const BASE_TOP_WIDTH = 2.5
export const BASE_HEIGHT = 0.6
export const BASE_DEPTH = 1

const TOP_BASE_WIDTH = 2
const TOP_TOP_WIDTH = 1.5
const TOP_HEIGHT = 0.5
export const TOP_DEPTH = 0.95

export function getChasis(gl, texture) {
    let level0Matrix = mat4.fromValues(
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

    let level1MatrixBase = mat4.fromValues(
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
        BASE_DEPTH,
        1
    )

    const baseTrapezoid = new Trapezoid(
        BASE_BASE_WIDTH,
        BASE_TOP_WIDTH,
        BASE_HEIGHT
    )
    const carBaseBuffers = generateSweepSurface(
        gl,
        baseTrapezoid,
        [level0Matrix, level1MatrixBase],
        true,
        true
    )
    const carBase = new Model(
        gl.TRIANGLE_STRIP,
        carBaseBuffers.glPositionBuffer,
        carBaseBuffers.glNormalBuffer,
        carBaseBuffers.glIndexBuffer,
        carBaseBuffers.glUVBuffer,
        texture
    )

    let level1MatrixTop = mat4.fromValues(
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
        TOP_DEPTH,
        1
    )

    const topTrapezoid = new Trapezoid(
        TOP_BASE_WIDTH,
        TOP_TOP_WIDTH,
        TOP_HEIGHT
    )
    const carTopBuffers = generateSweepSurface(
        gl,
        topTrapezoid,
        [level0Matrix, level1MatrixTop],
        true,
        true
    )
    const carTop = new Model(
        gl.TRIANGLE_STRIP,
        carTopBuffers.glPositionBuffer,
        carTopBuffers.glNormalBuffer,
        carTopBuffers.glIndexBuffer,
        carTopBuffers.glUVBuffer,
        texture
    )

    carTop.translationVector = [0, BASE_HEIGHT / 2 + TOP_HEIGHT / 2, 0]

    const carChasis = new Model()
    carChasis.addChild(carBase)
    carChasis.addChild(carTop)
    return carChasis
}
