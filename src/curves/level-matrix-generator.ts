import { vec3, mat4 } from 'gl-matrix'

// Receives an array of 2D coordinates (X and Z)
export function generateLevelMatrices(levels: number[][]) {
    const levelMatrices = []
    for (let i = 0; i < levels.length - 1; i++) {
        levelMatrices.push(generateLevelMatrix(levels[i], levels[i + 1]))
    }
    levelMatrices.push(
        generateLastLevelMatrix(
            levels[levels.length - 2],
            levels[levels.length - 1]
        )
    )
    return levelMatrices
}

function generateLevelMatrix(currentLevel: number[], nextLevel: number[]) {
    const tangent = getTangent(currentLevel, nextLevel)
    const binormal = vec3.fromValues(0, 1, 0)
    const normal = getNormal(tangent)
    return buildLevelMatrix(tangent, normal, binormal, currentLevel)
}

function generateLastLevelMatrix(
    previousLevel: number[],
    currentLevel: number[]
) {
    const tangent = getTangent(previousLevel, currentLevel)
    const binormal = vec3.fromValues(0, 1, 0)
    const normal = getNormal(tangent)
    return buildLevelMatrix(tangent, normal, binormal, currentLevel)
}

function getTangent(currentLevel: number[], nextLevel: number[]) {
    const tangent = vec3.fromValues(
        nextLevel[0] - currentLevel[0],
        0,
        nextLevel[1] - currentLevel[1]
    )
    vec3.normalize(tangent, tangent)
    return tangent
}

function getNormal(tangent: vec3) {
    const normal = vec3.create()
    vec3.rotateY(normal, tangent, [0, 0, 0], Math.PI / 2)
    return normal
}

function buildLevelMatrix(
    tangent: vec3,
    normal: vec3,
    binormal: vec3,
    position: number[]
) {
    return mat4.fromValues(
        normal[0],
        normal[1],
        normal[2],
        0,
        binormal[0],
        binormal[1],
        binormal[2],
        0,
        tangent[0],
        tangent[1],
        tangent[2],
        0,
        position[0],
        0,
        position[1],
        1
    )
}

export function translateMatrixAlongNormalAxis(
    levelMatrix: mat4,
    offset: number
) {
    // levelMatrix[0-2] = normal, normalized
    const newPosition = [
        levelMatrix[12] + offset * levelMatrix[0],
        levelMatrix[13] + offset * levelMatrix[1],
        levelMatrix[14] + offset * levelMatrix[2],
    ]
    const newLevelMatrix = mat4.create()
    mat4.copy(newLevelMatrix, levelMatrix)
    newLevelMatrix[12] = newPosition[0]
    newLevelMatrix[13] = newPosition[1]
    newLevelMatrix[14] = newPosition[2]
    return newLevelMatrix
}

export function translateMatricesAlongNormalAxis(
    levelMatrices: mat4[],
    offset: number
) {
    return levelMatrices.map((levelMatrix) =>
        translateMatrixAlongNormalAxis(levelMatrix, offset)
    )
}

export function reverseLevelMatrix(levelMatrix: mat4) {
    const newLevelMatrix = mat4.create()
    mat4.copy(newLevelMatrix, levelMatrix)
    const indexesToReverse = [
        0,
        1,
        2, // Normal
        8,
        9,
        10, // Tangent
    ]
    indexesToReverse.forEach(
        (index) => (newLevelMatrix[index] = -newLevelMatrix[index])
    )
    return newLevelMatrix
}

export function reverseLevelMatrices(levelMatrices: mat4[]) {
    return levelMatrices
        .reverse()
        .map((levelMatrix) => reverseLevelMatrix(levelMatrix))
}

export function getPositionFromLevelMatrix(levelMatrix: mat4) {
    return levelMatrix.slice(12, 15)
}

export function getPositionsFromLevelMatrices(levelMatrices: mat4[]) {
    return levelMatrices.map((levelMatrix) =>
        getPositionFromLevelMatrix(levelMatrix)
    )
}
