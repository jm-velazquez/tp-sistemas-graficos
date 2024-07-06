import { mat4 } from 'gl-matrix'
import { Bezier2 } from '/src/curves/bezier.js'
import { Model } from '/src/models/model.js'
import { Circle } from '/src/shapes/circle.js'
import { Trapezoid } from '/src/shapes/trapezoid.js'
import { generateLevelMatrices } from '/src/curves/level-matrix-generator.js'
import { generateSweepSurface } from '/src/surface-generator.js'

const POLE_RADIUS = 0.2
const STREET_LIGHT_HEIGHT = 20
const POLE_CURVE_RADIUS = 10

const LIGHTBULB_WIDTH = 1
const LIGHTBULB_BASE = 3
const LIGHTBULB_TOP = 2
const LIGHTBULB_HEIGHT = 0.3

function getLightbulb(gl, texture) {
    const lightbulbShape = new Trapezoid(
        LIGHTBULB_BASE,
        LIGHTBULB_TOP,
        LIGHTBULB_HEIGHT
    )
    const levelMatrix1 = mat4.fromValues(
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
    const levelMatrix2 = mat4.fromValues(
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
        LIGHTBULB_WIDTH,
        1
    )
    const lightbulbBuffers = generateSweepSurface(
        gl,
        lightbulbShape,
        [levelMatrix1, levelMatrix2],
        true,
        true
    )
    const lightbulb = new Model(
        gl.TRIANGLE_STRIP,
        lightbulbBuffers.glPositionBuffer,
        lightbulbBuffers.glNormalBuffer,
        lightbulbBuffers.glIndexBuffer,
        lightbulbBuffers.glUVBuffer,
        texture
    )
    lightbulb.translationVector = [
        POLE_CURVE_RADIUS,
        STREET_LIGHT_HEIGHT - POLE_RADIUS,
        -LIGHTBULB_WIDTH / 2,
    ]
    return lightbulb
}

function getPole(gl, texture) {
    const poleShape = new Circle(POLE_RADIUS)
    const bezierCurve = new Bezier2()
    bezierCurve.setControlPoints([
        [0, 0],
        [0, 0],
        [0, STREET_LIGHT_HEIGHT - POLE_CURVE_RADIUS],
        [0, STREET_LIGHT_HEIGHT - POLE_CURVE_RADIUS],
        [0, STREET_LIGHT_HEIGHT],
        [POLE_CURVE_RADIUS, STREET_LIGHT_HEIGHT],
        [POLE_CURVE_RADIUS, STREET_LIGHT_HEIGHT],
    ])
    const levels = bezierCurve.getPolygon()
    const levelMatrices = generateLevelMatrices(levels)
    const poleBuffers = generateSweepSurface(
        gl,
        poleShape,
        levelMatrices,
        false,
        true
    )
    const pole = new Model(
        gl.TRIANGLE_STRIP,
        poleBuffers.glPositionBuffer,
        poleBuffers.glNormalBuffer,
        poleBuffers.glIndexBuffer,
        poleBuffers.glUVBuffer,
        texture
    )
    pole.rotationAxis = [1, 0, 0]
    pole.rotationDegree = -Math.PI / 2
    return pole
}

export function getStreetLight(gl, texture) {
    const lightbulb = getLightbulb(gl, texture)
    const pole = getPole(gl, texture)
    const streetLight = new Model()
    streetLight.addChild(lightbulb)
    streetLight.addChild(pole)
    return streetLight
}
