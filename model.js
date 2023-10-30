
class Model {
    positionBuffer = null;
    normalBuffer = null;
    indexBuffer = null;

    children = [];
    modelMatrix = glMatrix.mat4.create();

    translationVector = [0, 0, 0];
    rotationAxis = [1, 0, 0];
    rotationDegree = 0;
    scalingVector = [1, 1, 1];

    constructor(positionBuffer = null, normalBuffer = null, indexBuffer = null) {
        this.positionBuffer = positionBuffer;
        this.normalBuffer = normalBuffer;
        this.indexBuffer = indexBuffer;
        glMatrix.mat4.identity(this.modelMatrix);
    }

    addChild(child) {
        this.children.push(child);
    }

    updateModelMatrix() {
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, this.translationVector);
        glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationDegree, this.rotationAxis);
        glMatrix.mat4.scale(this.modelMatrix, this.modelMatrix, this.scalingVector);
    }


    draw(parentMatrix, glProgram, viewMatrix, projMatrix, normalMatrix) {
        this.updateModelMatrix();

        let matrix = glMatrix.mat4.create();
        glMatrix.mat4.multiply(matrix, parentMatrix, this.modelMatrix);
        if (this.positionBuffer && this.normalBuffer && this.indexBuffer) {
            var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
            var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
            var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
            var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

            gl.uniformMatrix4fv(modelMatrixUniform, false, matrix);
            gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
            gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
            gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
            
            let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements( gl.TRIANGLE_STRIP, this.indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
        }

        this.children.forEach(child => child.draw(matrix, glProgram, viewMatrix, projMatrix, normalMatrix));
    }
}
