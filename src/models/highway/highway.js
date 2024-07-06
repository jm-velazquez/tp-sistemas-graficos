import { vec3 } from 'gl-matrix'
import {
    generateLevelMatrices,
    translateMatricesAlongNormalAxis,
} from '../../curves/level-matrix-generator.js'
import { Rectangle } from '../../shapes/rectangle.js'
import { Trapezoid } from '../../shapes/trapezoid.js'
import { generateSweepSurface } from '/src/surface-generator.js'
import { Model } from '../model.js'
import { LUT } from '../../curves/look-up-table.js'
import { getStreetLight } from './street-light.js'
import { getColumn } from './column.js'

const ROAD_WIDTH = 48
const ROAD_HEIGHT = 6

function getLights(gl, texture, levelMatrices, amountOfLights) {
    const levels = levelMatrices.map((levelMatrix) => [
        levelMatrix[12],
        levelMatrix[14],
    ])
    const lut = new LUT(levels)
    const distance = lut.getTotalDistance() / (amountOfLights - 1)

    const streetLights = []
    for (let i = 0; i < amountOfLights; i++) {
        const streetLight = getStreetLight(gl, texture)
        const position = lut.getInterpolatedPoint(distance * i)

        // Get normal of the closest past level
        const index = lut.getClosestPointAndIndex(distance * i)[1]
        const levelMatrix = levelMatrices[index]
        const normal = [levelMatrix[0], levelMatrix[1], levelMatrix[2]]

        const isEven = i % 2 === 0
        streetLight.rotationAxis = [0, 1, 0]
        streetLight.rotationDegree =
            vec3.angle(normal, [0, 0, 1]) + Math.PI / 2 + isEven * Math.PI
        streetLight.translationVector = [position[0], 2, position[1]]
        streetLights.push(streetLight)
    }
    return streetLights
}

function getColumns(gl, pillarTexture, baseTexture, levels, amountOfColumns) {
    const lut = new LUT(levels)
    const distance = lut.getTotalDistance() / (amountOfColumns - 1)

    const columns = []
    for (let i = 0; i < amountOfColumns; i++) {
        const column = getColumn(gl, pillarTexture, baseTexture, 30)
        const position = lut.getInterpolatedPoint(distance * i)
        column.translationVector = [position[0], 0, position[1]]
        columns.push(column)
    }
    return columns
}

function getRoad(gl, texture, levelMatrices) {
    const roadShape = new Rectangle(ROAD_WIDTH, ROAD_HEIGHT)
    const roadBuffers = generateSweepSurface(
        gl,
        roadShape,
        levelMatrices,
        true,
        true,
        1
    )

    return new Model(
        gl.TRIANGLE_STRIP,
        roadBuffers.glPositionBuffer,
        roadBuffers.glNormalBuffer,
        roadBuffers.glIndexBuffer,
        roadBuffers.glUVBuffer,
        texture
    )
}

function getGuardrail(gl, texture, levelMatrices) {
    const guardrailShape = new Trapezoid(1, 0.5, 1)
    const guardrailBuffers = generateSweepSurface(
        gl,
        guardrailShape,
        levelMatrices,
        true,
        true
    )

    const guardrail = new Model(
        gl.TRIANGLE_STRIP,
        guardrailBuffers.glPositionBuffer,
        guardrailBuffers.glNormalBuffer,
        guardrailBuffers.glIndexBuffer,
        guardrailBuffers.glUVBuffer,
        texture
    )
    guardrail.translationVector = [0, 3.5, 0]
    return guardrail
}

export function getHighway(
    gl,
    textureMap,
    levels,
    amountOfLights,
    amountOfColumns
) {
    const levelMatrices = generateLevelMatrices(levels)

    const road = getRoad(
        gl,
        textureMap.getTexture('highwayRoad'),
        levelMatrices
    )

    const middleGuardrail = getGuardrail(
        gl,
        textureMap.getTexture('concrete'),
        levelMatrices
    )
    road.addChild(middleGuardrail)

    const rightGuardrailMatrices = translateMatricesAlongNormalAxis(
        levelMatrices,
        ROAD_WIDTH / 2
    )
    const rightGuardrail = getGuardrail(
        gl,
        textureMap.getTexture('concrete'),
        rightGuardrailMatrices
    )
    road.addChild(rightGuardrail)

    const leftGuardrailMatrices = translateMatricesAlongNormalAxis(
        levelMatrices,
        -ROAD_WIDTH / 2
    )
    const leftGuardrail = getGuardrail(
        gl,
        textureMap.getTexture('concrete'),
        leftGuardrailMatrices
    )
    road.addChild(leftGuardrail)

    const streetLights = getLights(
        gl,
        textureMap.getTexture('lightGrey'),
        levelMatrices,
        amountOfLights
    )
    streetLights.forEach((streetLight) => road.addChild(streetLight))

    const columns = getColumns(
        gl,
        textureMap.getTexture('concrete'),
        textureMap.getTexture('concreteWall'),
        levels,
        amountOfColumns
    )
    columns.forEach((column) => road.addChild(column))

    return road
}
