import { getGlBuffersFromBuffers } from "./gl/gl-buffers.js";

function getIndexBuffer(rows, columns) {
    let index = [];
    for (var i = 0; i < rows - 1; i++) {
        index.push(i * columns);
        for (var j = 0; j < columns - 1; j++) {
            index.push(i * columns + j);
            index.push((i + 1) * columns + j);
            index.push(i * columns + j + 1);
            index.push((i + 1) * columns + j + 1);
        }
        index.push((i + 1) * columns + columns - 1);
    }
    return index;
}

function generateSurfaceBuffers(surface, rows, columns) {
    let positionBuffer = [];
    let normalBuffer = [];
    let uvBuffer = [];
    for (let i=0; i <= rows; i++) {
        for (let j=0; j <= columns; j++) {
            let u = j/columns;
            let v = i/rows;

            let pos = surface.getPosition(u,v);
            positionBuffer.push(pos[0], pos[1], pos[2]);

            let normal = surface.getNormal(u,v);
            normalBuffer.push(normal[0], normal[1], normal[2]);

            let uvs = surface.getTextureCoordinates(u,v);
            uvBuffer.push(uvs[0], uvs[1]);
        }
    }

    const indexBuffer = getIndexBuffer(rows, columns);

    return getGlBuffersFromBuffers(positionBuffer, normalBuffer, uvBuffer, indexBuffer);
}

export function generateSweepSurface(gl, glMatrix, positionVectors, normalVectors, levelMatrices) {
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
    [bottomBuffers, topBuffers] = generateTopAndBottomBuffers(positionVectors, levelMatrices);

    positionBuffer = bottomBuffers.positionBuffer.concat(positionBuffer, topBuffers.positionBuffer);
    normalBuffer = bottomBuffers.normalBuffer.concat(normalBuffer, topBuffers.normalBuffer);

	let indexBuffer = getIndexBuffer(levelMatrices.length + 4, positionVectors.length);
    return getGlBuffersFromBuffers(gl, positionBuffer, normalBuffer, [], indexBuffer);
}

function getAveragePosition(positionVectors) {
    let result = glMatrix.vec4.create();
    positionVectors.forEach(vector => glMatrix.vec4.add(result, result, vector));
    glMatrix.vec4.scale(result,result, 1 / positionVectors.length);
    return result;
}

function generateTopAndBottomBuffers(positionVectors, levelMatrices) {
    let averagePosition = getAveragePosition(positionVectors);
    let bottomPositionBuffer = [];
    let bottomNormalBuffer = [];
    let bottomAveragePosition = glMatrix.vec4.create();

    let bottomNormalVector = glMatrix.vec4.fromValues(0,0,-1);
    glMatrix.vec4.transformMat4(bottomNormalVector, bottomNormalVector, levelMatrices[0]);
    glMatrix.vec4.transformMat4(bottomAveragePosition, averagePosition, levelMatrices[0]);
    for (let i = 0; i < positionVectors.length; i++) {
        bottomPositionBuffer.push(
            bottomAveragePosition[0], bottomAveragePosition[1], bottomAveragePosition[2],
        );
        bottomNormalBuffer.push(bottomNormalVector[0], bottomNormalVector[1], bottomNormalVector[2]);
    }

    positionVectors.forEach(positionVector => {
        const newPositionVector = glMatrix.vec4.create();
        glMatrix.vec4.transformMat4(newPositionVector, positionVector, levelMatrices[0]);
        bottomPositionBuffer.push(
            newPositionVector[0], newPositionVector[1], newPositionVector[2],
        );
        bottomNormalBuffer.push(0,0,-1);
    });

    let topPositionBuffer = [];
    let topNormalBuffer = [];
    positionVectors.forEach(positionVector => {
        const newPositionVector = glMatrix.vec4.create();
        glMatrix.vec4.transformMat4(newPositionVector, positionVector, levelMatrices[levelMatrices.length - 1]);
        topPositionBuffer.push(
            newPositionVector[0], newPositionVector[1], newPositionVector[2],
        );
        topNormalBuffer.push(0,0,1);
    });
    const newAveragePosition = glMatrix.vec4.create();
    glMatrix.vec4.transformMat4(newAveragePosition, averagePosition, levelMatrices[levelMatrices.length - 1]);
    
    let topNormalVector = glMatrix.vec4.fromValues(0,0,1);
    glMatrix.vec4.transformMat4(topNormalVector, topNormalVector, levelMatrices[levelMatrices.length - 1]);

    for (let i = 0; i < positionVectors.length; i++) {
        topPositionBuffer.push(
            newAveragePosition[0], newAveragePosition[1], newAveragePosition[2],
        );
        topNormalBuffer.push(topNormalVector[0], topNormalVector[1], topNormalVector[2]);
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
