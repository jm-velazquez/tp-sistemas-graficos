export function getIntersectionBuffers(
    sideLength,
    xOffset = 0,
    yOffset = 0,
    indexBufferOffset = 0
) {
    const positionBuffer = [
        xOffset - sideLength / 2,
        yOffset - sideLength / 2,
        0,
        xOffset - sideLength / 2,
        yOffset + sideLength / 2,
        0,
        xOffset + sideLength / 2,
        yOffset - sideLength / 2,
        0,
        xOffset - sideLength / 2,
        yOffset + sideLength / 2,
        0,
        xOffset + sideLength / 2,
        yOffset - sideLength / 2,
        0,
        xOffset + sideLength / 2,
        yOffset + sideLength / 2,
        0,
    ]

    const normalBuffer = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]

    const uvBuffer = [0.5, 0, 0.5, 1, 1, 0, 0.5, 1, 1, 0, 1, 1]
    let indexBuffer = [0, 1, 2, 3, 4, 5]
    indexBuffer = indexBuffer.map((x) => x + indexBufferOffset)
    return { positionBuffer, normalBuffer, uvBuffer, indexBuffer }
}
