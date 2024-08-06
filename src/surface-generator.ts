import { mat4, vec2, vec3, vec4 } from 'gl-matrix'
import { getGlBuffersFromBuffers } from './gl/gl-buffers'
import { Shape } from './shapes/shape.js'

function distance2(vec1: number[], vec2: number[]) {
    return Math.sqrt(
        Math.pow(vec1[0] - vec2[0], 2) + Math.pow(vec1[1] - vec2[1], 2)
    )
}

function getShapePerimeter(points: vec4[]) {
    let perimeter = 0
    let lastPoint = points[0]
    for (let i = 1; i < points.length; i++) {
        const currentPoint = points[i]
        perimeter += distance2(
            [lastPoint[0], lastPoint[1]],
            [currentPoint[0], currentPoint[1]]
        )
        lastPoint = currentPoint
    }
    return perimeter
}

export function generateSweepSurface(
    gl: WebGLRenderingContext,
    coverShape: Shape,
    levelMatrices: mat4[],
    withBottomCover: boolean,
    withTopCover: boolean,
    widthUVMultiplier = 1
) {
    let positionBuffer = []
    let normalBuffer = []
    let uvBuffer = []

    const { positionArray, normalArray, uvArray } = coverShape.getArrays()

    const shapePerimeter = getShapePerimeter(positionArray)

    for (let i = 0; i < levelMatrices.length; i++) {
        let normalMatrix = mat4.create()
        mat4.invert(normalMatrix, levelMatrices[i])
        mat4.transpose(normalMatrix, normalMatrix)

        let lastPoint = positionArray[0]
        let distanceSum = 0
        for (let j = 0; j < positionArray.length; j++) {
            const newPosition = vec4.create()
            const newNormal = vec4.create()
            vec4.transformMat4(newPosition, positionArray[j], levelMatrices[i])
            vec4.transformMat4(newNormal, normalArray[j], normalMatrix)

            positionBuffer.push(newPosition[0], newPosition[1], newPosition[2])
            normalBuffer.push(newNormal[0], newNormal[1], newNormal[2])

            distanceSum += distance2(
                [lastPoint[0], lastPoint[1]],
                [positionArray[j][0], positionArray[j][1]]
            )
            const u = (distanceSum / shapePerimeter) * widthUVMultiplier
            const v = i % 2 === 0 ? 1 : 0
            uvBuffer.push(u, v)

            lastPoint = positionArray[j]
        }
    }

    let bottomBuffers,
        topBuffers = null
    ;[bottomBuffers, topBuffers] = generateTopAndBottomBuffers(
        positionArray,
        uvArray,
        levelMatrices,
        withBottomCover,
        withTopCover
    )

    let rows = levelMatrices.length
    if (withBottomCover) {
        positionBuffer = bottomBuffers.positionBuffer.concat(positionBuffer)
        normalBuffer = bottomBuffers.normalBuffer.concat(normalBuffer)
        uvBuffer = bottomBuffers.uvBuffer.concat(uvBuffer)
        rows += 2
    }
    if (withTopCover) {
        positionBuffer = positionBuffer.concat(topBuffers.positionBuffer)
        normalBuffer = normalBuffer.concat(topBuffers.normalBuffer)
        uvBuffer = uvBuffer.concat(topBuffers.uvBuffer)
        rows += 2
    }
    let indexBuffer = getIndexBuffer(rows, positionArray.length)
    return getGlBuffersFromBuffers(
        gl,
        positionBuffer,
        normalBuffer,
        uvBuffer,
        indexBuffer
    )
}

export function generateRevolutionSurface(
    gl: WebGLRenderingContext,
    shape: Shape,
    numberOfLevels: number,
    withBottomCover: boolean,
    withTopCover: boolean
) {
    const angleIncrement = (2 * Math.PI) / numberOfLevels

    const levelMatrices = []

    for (let i = 0; i < numberOfLevels + 1; i++) {
        const angle = i * angleIncrement
        const tangent = vec3.create()
        const normal = vec3.create()
        vec3.rotateY(tangent, [0, 0, 1], [0, 0, 0], angle)
        vec3.rotateY(normal, [1, 0, 0], [0, 0, 0], angle)
        const levelMatrix = mat4.fromValues(
            normal[0],
            normal[1],
            normal[2],
            0,
            0,
            1,
            0,
            0,
            tangent[0],
            tangent[1],
            tangent[2],
            0,
            0,
            0,
            0,
            1
        )
        levelMatrices.push(levelMatrix)
    }
    return generateSweepSurface(
        gl,
        shape,
        levelMatrices,
        withBottomCover,
        withTopCover
    )
}

function getIndexBuffer(rows: number, columns: number) {
    let index = []
    for (let i = 0; i < rows - 1; i++) {
        index.push(i * columns)
        for (let j = 0; j < columns - 1; j++) {
            index.push(i * columns + j)
            index.push((i + 1) * columns + j)
            index.push(i * columns + j + 1)
            index.push((i + 1) * columns + j + 1)
        }
        index.push((i + 1) * columns + columns - 1)
    }
    return index
}

function getAveragePosition(positionVectors: vec4[]) {
    let result = vec4.create()
    positionVectors.forEach((vector) => vec4.add(result, result, vector))
    vec4.scale(result, result, 1 / positionVectors.length)
    return result
}

function generateTopAndBottomBuffers(
    positionArray: vec4[],
    uvArray: vec2[],
    levelMatrices: mat4[],
    withBottomCover: boolean,
    withTopCover: boolean
) {
    let averagePosition = getAveragePosition(positionArray)
    let bottomPositionBuffer = []
    let bottomNormalBuffer = []
    const bottomUVBuffer: number[] = []

    if (withBottomCover) {
        // Bottom Normal Vector
        let bottomNormalVector = vec4.fromValues(0, 0, -1, 1)
        vec4.transformMat4(
            bottomNormalVector,
            bottomNormalVector,
            levelMatrices[0]
        )
        vec4.normalize(bottomNormalVector, bottomNormalVector)
        // Bottom Center Vertex Row
        let bottomAveragePosition = vec4.create()
        vec4.transformMat4(
            bottomAveragePosition,
            averagePosition,
            levelMatrices[0]
        )
        for (let i = 0; i < positionArray.length; i++) {
            bottomPositionBuffer.push(
                bottomAveragePosition[0],
                bottomAveragePosition[1],
                bottomAveragePosition[2]
            )
            bottomNormalBuffer.push(
                bottomNormalVector[0],
                bottomNormalVector[1],
                bottomNormalVector[2]
            )
            bottomUVBuffer.push(0.5, 0.5)
        }

        // Bottom Shape Vertex (with same normal vector as bottom center)
        positionArray.forEach((positionVector) => {
            const newPositionVector = vec4.create()
            vec4.transformMat4(
                newPositionVector,
                positionVector,
                levelMatrices[0]
            )
            bottomPositionBuffer.push(
                newPositionVector[0],
                newPositionVector[1],
                newPositionVector[2]
            )
            bottomNormalBuffer.push(
                bottomNormalVector[0],
                bottomNormalVector[1],
                bottomNormalVector[2]
            )
        })
        bottomUVBuffer.push(...uvArray.flatMap((vector: vec2) => [vector[0], vector[1]]))
    }

    let topPositionBuffer = []
    let topNormalBuffer = []
    const topUVBuffer = []

    if (withTopCover) {
        // Top Normal Vector
        let topNormalVector = vec4.fromValues(0, 0, 1, 1)
        vec4.transformMat4(
            topNormalVector,
            topNormalVector,
            levelMatrices[levelMatrices.length - 1]
        )
        vec4.normalize(topNormalVector, topNormalVector)
        // Top Shape Vertex (with same normal vector as top center)
        positionArray.forEach((positionVector) => {
            const newPositionVector = vec4.create()
            vec4.transformMat4(
                newPositionVector,
                positionVector,
                levelMatrices[levelMatrices.length - 1]
            )
            topPositionBuffer.push(
                newPositionVector[0],
                newPositionVector[1],
                newPositionVector[2]
            )
            topNormalBuffer.push(
                topNormalVector[0],
                topNormalVector[1],
                topNormalVector[2]
            )
        })
        topUVBuffer.push(...uvArray.flatMap((vector: vec2) => [vector[0], vector[1]]))
        // Top Center Vertex Row
        const newAveragePosition = vec4.create()
        vec4.transformMat4(
            newAveragePosition,
            averagePosition,
            levelMatrices[levelMatrices.length - 1]
        )
        for (let i = 0; i < positionArray.length; i++) {
            topPositionBuffer.push(
                newAveragePosition[0],
                newAveragePosition[1],
                newAveragePosition[2]
            )
            topNormalBuffer.push(
                topNormalVector[0],
                topNormalVector[1],
                topNormalVector[2]
            )
            topUVBuffer.push(0.5, 0.5)
        }
    }

    return [
        {
            positionBuffer: bottomPositionBuffer,
            normalBuffer: bottomNormalBuffer,
            uvBuffer: bottomUVBuffer,
        },
        {
            positionBuffer: topPositionBuffer,
            normalBuffer: topNormalBuffer,
            uvBuffer: topUVBuffer,
        },
    ]
}
