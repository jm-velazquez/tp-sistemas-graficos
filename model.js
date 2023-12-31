
export class Model {
    positionBuffer = null;
    normalBuffer = null;
    uvBuffer = null;
    indexBuffer = null;

    children = [];
    modelMatrix = glMatrix.mat4.create();

    translationVector = [0, 0, 0];
    rotationAxis = [1, 0, 0];
    rotationDegree = 0;
    scalingVector = [1, 1, 1];

    drawMode = null;

    constructor(drawMode = null, positionBuffer = null, normalBuffer = null, indexBuffer = null, uvBuffer = null) {
        this.drawMode = drawMode;
        this.positionBuffer = positionBuffer;
        this.normalBuffer = normalBuffer;
        this.indexBuffer = indexBuffer;
        this.uvBuffer = uvBuffer;
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

    getWorldCoordinates(parentMatrix) {
        this.updateModelMatrix();
        let matrix = glMatrix.mat4.create();
        glMatrix.mat4.multiply(matrix, parentMatrix, this.modelMatrix);

        const worldCoordinates = glMatrix.vec4.fromValues(0,0,0,1);
        glMatrix.vec4.transformMat4(worldCoordinates, worldCoordinates, matrix);
        
        const childrenWorldCoordinates = this.children.map(child => child.getWorldCoordinates(matrix));
        childrenWorldCoordinates.unshift(worldCoordinates);
        return childrenWorldCoordinates;
    }

    draw(gl, glMatrix, glProgram, parentMatrix, viewMatrix, projMatrix) {
        this.updateModelMatrix();
        let matrix = glMatrix.mat4.create();
        glMatrix.mat4.multiply(matrix, parentMatrix, this.modelMatrix);

        if (this.drawMode && this.positionBuffer && this.normalBuffer && this.indexBuffer) {
            let normalMatrix = glMatrix.mat4.clone(matrix);
            glMatrix.mat4.invert(normalMatrix, normalMatrix);
            glMatrix.mat4.transpose(normalMatrix,normalMatrix);

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
            gl.drawElements(this.drawMode, this.indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
        }

        this.children.forEach(child => child.draw(gl, glMatrix, glProgram, matrix, viewMatrix, projMatrix));
    }
}
