import { getGlBuffersFromBuffers } from "../gl/gl-buffers.js";

function getGridBuffers(gl, size) {
	const lowerBound = - size / 2;
	const upperBound = size / 2;

	const positionBuffer = [
		lowerBound, lowerBound, 0,
		lowerBound, upperBound, 0,
		upperBound, upperBound, 0,
		upperBound, lowerBound, 0,
		0, lowerBound, 0,
		0, upperBound, 0,
		lowerBound, 0, 0,
		upperBound, 0, 0,
	];

	const normalBuffer = Array(positionBuffer.length / 3).fill([0,0,1]).flat();

	const indexBuffer = [0,1,2,3,0,4,5,1,6,7];

	return getGlBuffersFromBuffers(gl, positionBuffer, normalBuffer, [], indexBuffer);
}

export function drawGrid(gl, glMatrix, glProgram, parentMatrix, viewMatrix, projMatrix) {
	const buffers = getGridBuffers(gl, 1000);

	let normalMatrix = glMatrix.mat4.create();
	glMatrix.mat4.invert(normalMatrix, viewMatrix);
	glMatrix.mat4.transpose(normalMatrix,normalMatrix);

	var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
	var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
	var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
	var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

	gl.uniformMatrix4fv(modelMatrixUniform, false, parentMatrix);
	gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
	gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
	
	let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.glPositionBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
	gl.enableVertexAttribArray(vertexNormalAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.glNormalBuffer);
	gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.glIndexBuffer);
	gl.drawElements(gl.LINE_STRIP, buffers.glIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
}
