export function getGlBuffersFromBuffers(gl, positionBuffer, normalBuffer, uvBuffer, indexBuffer) { 
  const glPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, glPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);    

  const glNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, glNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);

  const glIndexBuffer = gl.createBuffer();
  glIndexBuffer.number_vertex_point = indexBuffer.length;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
  // TODO: Add uvBuffer
  return {glPositionBuffer, glNormalBuffer, uvBuffer, glIndexBuffer}
}
