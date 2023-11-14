import { getGlBuffersFromBuffers } from "./gl/gl-buffers.js";

function getIndexBuffer(rows, columns) {
    let index = [];
    for (let i = 0; i < rows - 1; i++) {
        index.push(i * columns);
        for (let j = 0; j < columns - 1; j++) {
            index.push(i * columns + j);
            index.push((i + 1) * columns + j);
            index.push(i * columns + j + 1);
            index.push((i + 1) * columns + j + 1);
        }
        index.push((i + 1) * columns + columns - 1);
    }
    return index;
}

export function generateSweepSurface(gl, glMatrix, positionVectors,
    normalVectors, levelMatrices, withBottomCover, withTopCover) {
	let positionBuffer = [];
	let normalBuffer = [];

    for (let i = 0; i < levelMatrices.length; i++) {
        let normalMatrix = glMatrix.mat4.create();
        glMatrix.mat4.invert(normalMatrix, levelMatrices[i]);
        glMatrix.mat4.transpose(normalMatrix, normalMatrix);
		for (let j = 0; j < positionVectors.length; j++) {
			const newPosition = glMatrix.vec4.create();
			const newNormal = glMatrix.vec4.create();
			glMatrix.vec4.transformMat4(newPosition, positionVectors[j], levelMatrices[i]);
            glMatrix.vec4.transformMat4(newNormal, normalVectors[j], normalMatrix);

			positionBuffer.push(newPosition[0], newPosition[1], newPosition[2]);
			normalBuffer.push(newNormal[0], newNormal[1], newNormal[2]);
		}
    }

    let bottomBuffers, topBuffers = null;
    [bottomBuffers, topBuffers] = generateTopAndBottomBuffers(positionVectors, levelMatrices, withBottomCover, withTopCover);

    if (withBottomCover) {
        positionBuffer = bottomBuffers.positionBuffer.concat(positionBuffer);
        normalBuffer = bottomBuffers.normalBuffer.concat(normalBuffer);
    }
    if (withTopCover) {
        positionBuffer = positionBuffer.concat(topBuffers.positionBuffer);
        normalBuffer = normalBuffer.concat(topBuffers.normalBuffer);
    }

	let indexBuffer = getIndexBuffer(
        levelMatrices.length + 2 * withBottomCover + 2 * withTopCover,
        positionVectors.length
    );
    return getGlBuffersFromBuffers(gl, positionBuffer, normalBuffer, [], indexBuffer);
}

function getAveragePosition(positionVectors) {
    let result = glMatrix.vec4.create();
    positionVectors.forEach(vector => glMatrix.vec4.add(result, result, vector));
    glMatrix.vec4.scale(result,result, 1 / positionVectors.length);
    return result;
}

function generateTopAndBottomBuffers(positionVectors, levelMatrices, withBottomCover, withTopCover) {
    let averagePosition = getAveragePosition(positionVectors);
    let bottomPositionBuffer = [];
    let bottomNormalBuffer = [];

    if (withBottomCover) {
        // Bottom Normal Vector
        let bottomNormalVector = glMatrix.vec4.fromValues(0,0,-1,1);
        glMatrix.vec4.transformMat4(bottomNormalVector, bottomNormalVector, levelMatrices[0]);
        glMatrix.vec4.normalize(bottomNormalVector, bottomNormalVector);
        // Bottom Center Vertex Row
        let bottomAveragePosition = glMatrix.vec4.create();
        glMatrix.vec4.transformMat4(bottomAveragePosition, averagePosition, levelMatrices[0]);
        for (let i = 0; i < positionVectors.length; i++) {
            bottomPositionBuffer.push(
                bottomAveragePosition[0], bottomAveragePosition[1], bottomAveragePosition[2],
            );
            bottomNormalBuffer.push(bottomNormalVector[0], bottomNormalVector[1], bottomNormalVector[2]);
        }

        // Bottom Shape Vertex (with same normal vector as bottom center)
        positionVectors.forEach(positionVector => {
            const newPositionVector = glMatrix.vec4.create();
            glMatrix.vec4.transformMat4(newPositionVector, positionVector, levelMatrices[0]);
            bottomPositionBuffer.push(
                newPositionVector[0], newPositionVector[1], newPositionVector[2],
            );
            bottomNormalBuffer.push(bottomNormalVector[0], bottomNormalVector[1], bottomNormalVector[2]);
        });
    }

    let topPositionBuffer = [];
    let topNormalBuffer = [];

    if (withTopCover) {
        // Top Normal Vector
        let topNormalVector = glMatrix.vec4.fromValues(0,0,1,1);
        glMatrix.vec4.transformMat4(topNormalVector, topNormalVector, levelMatrices[levelMatrices.length - 1]);
        glMatrix.vec4.normalize(topNormalVector, topNormalVector);
        // Top Shape Vertex (with same normal vector as top center)
        positionVectors.forEach(positionVector => {
            const newPositionVector = glMatrix.vec4.create();
            glMatrix.vec4.transformMat4(newPositionVector, positionVector, levelMatrices[levelMatrices.length - 1]);
            topPositionBuffer.push(
                newPositionVector[0], newPositionVector[1], newPositionVector[2],
            );
            topNormalBuffer.push(topNormalVector[0], topNormalVector[1], topNormalVector[2]);
        });
        // Top Center Vertex Row
        const newAveragePosition = glMatrix.vec4.create();
        glMatrix.vec4.transformMat4(newAveragePosition, averagePosition, levelMatrices[levelMatrices.length - 1]);
        for (let i = 0; i < positionVectors.length; i++) {
            topPositionBuffer.push(
                newAveragePosition[0], newAveragePosition[1], newAveragePosition[2],
            );
            topNormalBuffer.push(topNormalVector[0], topNormalVector[1], topNormalVector[2]);
        }
    }
    
    return [
        {
            positionBuffer: bottomPositionBuffer,
            normalBuffer: bottomNormalBuffer
        },
        {
            positionBuffer: topPositionBuffer,
            normalBuffer: topNormalBuffer
        }
    ];
}

function getBoxBuffers() {
    let positionBuffer = [];
    let normalBuffer = [];
    let indexBuffer = [];
    positionBuffer.push(
        0,0,0,
        1,0,0,
        0,1,0,
        1,1,0,
        1,1,0,
        1,1,1,
        0,1,0,
        0,1,1,
        0,1,1,
        0,1,0,
        0,0,1,
        0,0,0,
        0,0,0,
        0,0,1,
        1,0,0,
        1,0,1,
        1,0,1,
        1,0,0,
        1,1,1,
        1,1,0,
        1,1,1,
        0,1,1,
        1,0,1,
        0,0,1,
    );

    normalBuffer.push(
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,
        0,-1,0,
        0,-1,0,
        0,-1,0,
        0,-1,0,
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
    );

    indexBuffer.push(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,18,20,20,21,22,23);

    return getGlBuffersFromBuffers(positionBuffer, normalBuffer, [], indexBuffer);
}
