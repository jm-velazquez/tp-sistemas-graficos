import { mat4 } from 'gl-matrix'
import {
    generateRevolutionSurface,
    generateSweepSurface,
} from '../../surface-generator'
import { Model } from '../model'
import { Circle } from '../../shapes/circle'
import { QuarterCircle } from '../../shapes/quarter-circle'

function getPillar(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    columnHeight: number
) {
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
        columnHeight,
        1
    )

    const pillarShape = new Circle(8, 16)
    const pillarBuffers = generateSweepSurface(
        gl,
        pillarShape,
        [level0Matrix, level1Matrix],
        false,
        false,
        2
    )
    return new Model(
        gl.TRIANGLE_STRIP,
        pillarBuffers.glPositionBuffer,
        pillarBuffers.glNormalBuffer,
        pillarBuffers.glIndexBuffer,
        pillarBuffers.glUVBuffer,
        texture
    )
}

function getBase(gl: WebGLRenderingContext, texture: WebGLTexture) {
    const baseShape = new QuarterCircle(12)
    const baseBuffers = generateRevolutionSurface(gl, baseShape, 20, true, true)
    return new Model(
        gl.TRIANGLE_STRIP,
        baseBuffers.glPositionBuffer,
        baseBuffers.glNormalBuffer,
        baseBuffers.glIndexBuffer,
        baseBuffers.glUVBuffer,
        texture
    )
}

export function getColumn(
    gl: WebGLRenderingContext,
    pillarTexture: WebGLTexture,
    baseTexture: WebGLTexture,
    columnHeight: number
) {
    const pillar = getPillar(gl, pillarTexture, columnHeight)
    const base = getBase(gl, baseTexture)
    base.rotationAxis = [1, 0, 0]
    base.rotationDegree = -Math.PI / 2
    base.translationVector = [0, 0, columnHeight]
    pillar.addChild(base)
    pillar.rotationAxis = [1, 0, 0]
    pillar.rotationDegree = Math.PI / 2
    return pillar
}
