import { getGlBuffersFromBuffers } from "./gl/gl-buffers.js";

export function generateSweepSurface(gl, glMatrix, coverShape, levelMatrices, withBottomCover, withTopCover, widthUVMultiplier = 1) {
	let positionBuffer = [];
	let normalBuffer = [];
    let uvBuffer = [];

    const { positionArray, normalArray, uvArray } = coverShape.getArrays();

    for (let i = 0; i < levelMatrices.length; i++) {
        let normalMatrix = glMatrix.mat4.create();
        glMatrix.mat4.invert(normalMatrix, levelMatrices[i]);
        glMatrix.mat4.transpose(normalMatrix, normalMatrix);
		for (let j = 0; j < positionArray.length; j++) {
			const newPosition = glMatrix.vec4.create();
			const newNormal = glMatrix.vec4.create();
			glMatrix.vec4.transformMat4(newPosition, positionArray[j], levelMatrices[i]);
            glMatrix.vec4.transformMat4(newNormal, normalArray[j], normalMatrix);

			positionBuffer.push(newPosition[0], newPosition[1], newPosition[2]);
			normalBuffer.push(newNormal[0], newNormal[1], newNormal[2]);
            const u = j % 2 === 0 ? 1 * widthUVMultiplier : 0;
            const v = i % 2 === 0 ? 1 : 0;
            uvBuffer.push(u, v);
		}
    }

    let bottomBuffers, topBuffers = null;
    [bottomBuffers, topBuffers] = generateTopAndBottomBuffers(positionArray, uvArray, levelMatrices, withBottomCover, withTopCover);

    if (withBottomCover) {
        positionBuffer = bottomBuffers.positionBuffer.concat(positionBuffer);
        normalBuffer = bottomBuffers.normalBuffer.concat(normalBuffer);
        uvBuffer = bottomBuffers.uvBuffer.concat(uvBuffer);
    }
    if (withTopCover) {
        positionBuffer = positionBuffer.concat(topBuffers.positionBuffer);
        normalBuffer = normalBuffer.concat(topBuffers.normalBuffer);
        uvBuffer = uvBuffer.concat(topBuffers.uvBuffer);
    }

	let indexBuffer = getIndexBuffer(
        levelMatrices.length + 2 * withBottomCover + 2 * withTopCover,
        positionArray.length
    );
    return getGlBuffersFromBuffers(gl, positionBuffer, normalBuffer, uvBuffer, indexBuffer);
}

export function generateRevolutionSurface(gl, glMatrix, shape,
    numberOfLevels, withBottomCover, withTopCover) {
        const angleIncrement = 2 * Math.PI / numberOfLevels;

        const levelMatrices = [];
        
        for (let i = 0; i < numberOfLevels + 1; i++) {
            const angle = i * angleIncrement;
            const tangent = glMatrix.vec3.create();
            const normal = glMatrix.vec3.create();
            glMatrix.vec3.rotateY(tangent, [0, 0, 1], [0, 0, 0], angle);
            glMatrix.vec3.rotateY(normal, [1, 0, 0], [0, 0, 0], angle);
            const levelMatrix = glMatrix.mat4.fromValues(
                normal[0], normal[1], normal[2], 0,
                0, 1, 0, 0,
                tangent[0], tangent[1], tangent[2], 0,
                0,0,0,1,
            );
            levelMatrices.push(levelMatrix);
        }
        return generateSweepSurface(gl, glMatrix, shape,
            levelMatrices, withBottomCover, withTopCover);
    }

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

function getAveragePosition(positionVectors) {
    let result = glMatrix.vec4.create();
    positionVectors.forEach(vector => glMatrix.vec4.add(result, result, vector));
    glMatrix.vec4.scale(result,result, 1 / positionVectors.length);
    return result;
}

function generateTopAndBottomBuffers(positionArray, uvArray, levelMatrices, withBottomCover, withTopCover) {
    let averagePosition = getAveragePosition(positionArray);
    let bottomPositionBuffer = [];
    let bottomNormalBuffer = [];
    const bottomUVBuffer = [];

    if (withBottomCover) {
        // Bottom Normal Vector
        let bottomNormalVector = glMatrix.vec4.fromValues(0,0,-1,1);
        glMatrix.vec4.transformMat4(bottomNormalVector, bottomNormalVector, levelMatrices[0]);
        glMatrix.vec4.normalize(bottomNormalVector, bottomNormalVector);
        // Bottom Center Vertex Row
        let bottomAveragePosition = glMatrix.vec4.create();
        glMatrix.vec4.transformMat4(bottomAveragePosition, averagePosition, levelMatrices[0]);
        for (let i = 0; i < positionArray.length; i++) {
            bottomPositionBuffer.push(
                bottomAveragePosition[0], bottomAveragePosition[1], bottomAveragePosition[2],
            );
            bottomNormalBuffer.push(bottomNormalVector[0], bottomNormalVector[1], bottomNormalVector[2]);
            bottomUVBuffer.push(0.5, 0.5);
        }

        // Bottom Shape Vertex (with same normal vector as bottom center)
        positionArray.forEach(positionVector => {
            const newPositionVector = glMatrix.vec4.create();
            glMatrix.vec4.transformMat4(newPositionVector, positionVector, levelMatrices[0]);
            bottomPositionBuffer.push(
                newPositionVector[0], newPositionVector[1], newPositionVector[2],
            );
            bottomNormalBuffer.push(bottomNormalVector[0], bottomNormalVector[1], bottomNormalVector[2]);
        });
        bottomUVBuffer.push(...uvArray);
    }

    let topPositionBuffer = [];
    let topNormalBuffer = [];
    const topUVBuffer = [];

    if (withTopCover) {
        // Top Normal Vector
        let topNormalVector = glMatrix.vec4.fromValues(0,0,1,1);
        glMatrix.vec4.transformMat4(topNormalVector, topNormalVector, levelMatrices[levelMatrices.length - 1]);
        glMatrix.vec4.normalize(topNormalVector, topNormalVector);
        // Top Shape Vertex (with same normal vector as top center)
        positionArray.forEach(positionVector => {
            const newPositionVector = glMatrix.vec4.create();
            glMatrix.vec4.transformMat4(newPositionVector, positionVector, levelMatrices[levelMatrices.length - 1]);
            topPositionBuffer.push(
                newPositionVector[0], newPositionVector[1], newPositionVector[2],
            );
            topNormalBuffer.push(topNormalVector[0], topNormalVector[1], topNormalVector[2]);
        });
        topUVBuffer.push(...uvArray);
        // Top Center Vertex Row
        const newAveragePosition = glMatrix.vec4.create();
        glMatrix.vec4.transformMat4(newAveragePosition, averagePosition, levelMatrices[levelMatrices.length - 1]);
        for (let i = 0; i < positionArray.length; i++) {
            topPositionBuffer.push(
                newAveragePosition[0], newAveragePosition[1], newAveragePosition[2],
            );
            topNormalBuffer.push(topNormalVector[0], topNormalVector[1], topNormalVector[2]);
            topUVBuffer.push(0.5, 0.5);
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
