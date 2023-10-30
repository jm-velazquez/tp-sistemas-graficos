function getIndexBuffer(rows, columns) {
    let indexBuffer = [];  
    for (let i = 0; i < rows; i++) {
        for (j=0; j < columns; j++) {
            if (j === 0) {
                indexBuffer.push(i * (columns + 1) + j);
                indexBuffer.push((i + 1) * (columns + 1) + j);
            }
            indexBuffer.push(i * (columns + 1) + j + 1); 
            indexBuffer.push((i + 1) * (columns + 1) + j + 1);
        }
        if (i < rows - 1) {
            indexBuffer.push((i + 2) * (columns + 1) - 2);
            indexBuffer.push((i + 1) * (columns + 1));
        }
    }
    return indexBuffer;
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
