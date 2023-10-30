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

function getGlBuffersFromBuffers(positionBuffer, normalBuffer, uvBuffer, indexBuffer) { 
    glPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);    

    glNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);

    glIndexBuffer = gl.createBuffer();
    glIndexBuffer.number_vertex_point = indexBuffer.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    // TODO: Add uvBuffer
    return {glPositionBuffer, glNormalBuffer, uvBuffer, glIndexBuffer}
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

function generateSweepSurface(positionVectors, normalVectors, levelMatrices) {
	let positionBuffer = [];
	let normalBuffer = [];
	
	levelMatrices.forEach(matrix => {
        let normalMatrix = glMatrix.mat4.create();
        mat4.invert(normalMatrix, this.modelMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
		for (let i = 0; i < positionVectors.length; i++) {
			const newPosition = glMatrix.vec4.create();
			const newNormal = glMatrix.vec4.create();
            let positionVector = glMatrix.vec4.fromValues(
                positionVectors[i][0],
                positionVectors[i][1],
                positionVectors[i][2],
                1
            );
            let normalVector = glMatrix.vec4.fromValues(
                normalVectors[i][0],
                normalVectors[i][1],
                normalVectors[i][2],
                1
            );
			glMatrix.vec4.transformMat4(newPosition, positionVector, matrix);
            glMatrix.vec4.transformMat4(newNormal, normalVector, normalMatrix);

			positionBuffer.push(newPosition[0], newPosition[1], newPosition[2]);
			normalBuffer.push(newNormal[0], newNormal[1], newNormal[2]);
		}
	});

	let indexBuffer = getIndexBuffer(levelMatrices.length, positionVectors.length);
    return getGlBuffersFromBuffers(positionBuffer, normalBuffer, [], indexBuffer);
}
