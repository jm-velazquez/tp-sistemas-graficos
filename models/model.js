
export class Model {
    positionBuffer = null;
    normalBuffer = null;
    uvBuffer = null;
    indexBuffer = null;

    texture = null;

    affectedByLighting;

    children = [];
    modelMatrix = glMatrix.mat4.create();

    translationVector = [0, 0, 0];
    rotationAxis = [1, 0, 0];
    rotationDegree = 0;
    scalingVector = [1, 1, 1];

    drawMode = null;
    normalMap;

    constructor(drawMode = null, positionBuffer = null, normalBuffer = null, indexBuffer = null, uvBuffer = null, texture = null, affectedByLighting = true, normalMap = null) {
        this.drawMode = drawMode;
        this.positionBuffer = positionBuffer;
        this.normalBuffer = normalBuffer;
        this.indexBuffer = indexBuffer;
        this.uvBuffer = uvBuffer;
        this.texture = texture;
        this.affectedByLighting = affectedByLighting;
        this.normalMap = normalMap;
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

    draw(gl, glMatrix, glProgram, parentMatrix, viewMatrix, projMatrix, lightParameters) {
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
            
            // Buffers
            let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            let uvCoordsAttribute = gl.getAttribLocation(glProgram, "aTextureCoord");
            gl.enableVertexAttribArray(uvCoordsAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.vertexAttribPointer(uvCoordsAttribute, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(gl.getUniformLocation(glProgram, "uSampler"), 0);

            // For skybox
            let affectedByLightingAttribute = gl.getUniformLocation(glProgram, "affectedByLighting");
            gl.uniform1i(affectedByLightingAttribute, this.affectedByLighting);

            // Ambient lighting
            const ambientTopColorAttribute = gl.getUniformLocation(glProgram, "ambientTopColor");
            gl.uniform3fv(ambientTopColorAttribute, lightParameters.ambientLight.topColor);

            const ambientBottomColorAttribute = gl.getUniformLocation(glProgram, "ambientBottomColor");
            gl.uniform3fv(ambientBottomColorAttribute, lightParameters.ambientLight.bottomColor);

            const ambientLightStrengthAttribute = gl.getUniformLocation(glProgram, "ambientLightStrength");
            gl.uniform1f(ambientLightStrengthAttribute, lightParameters.ambientLight.strength);

            // Directional lighting
            const directionalLightColorAttribute = gl.getUniformLocation(glProgram, "directionalLightColor");
            gl.uniform3fv(directionalLightColorAttribute, lightParameters.directionalLight.color);

            const directionalLightVectorAttribute = gl.getUniformLocation(glProgram, "directionalLightVector");
            gl.uniform3fv(directionalLightVectorAttribute, lightParameters.directionalLight.direction);

            const directionalLightStrengthAttribute = gl.getUniformLocation(glProgram, "directionalLightStrength");
            gl.uniform1f(directionalLightStrengthAttribute, lightParameters.directionalLight.strength);

            // Point lighting
            const pointLightColorAttribute = gl.getUniformLocation(glProgram, "pointLightColor");
            gl.uniform3fv(pointLightColorAttribute, lightParameters.pointLight.color);

            const pointLightStrengthAttribute = gl.getUniformLocation(glProgram, "pointLightStrength");
            gl.uniform1f(pointLightStrengthAttribute, lightParameters.pointLight.strength);

            const light1WorldPositionAttribute = gl.getUniformLocation(glProgram, "light1WorldPosition");
            gl.uniform3fv(light1WorldPositionAttribute, lightParameters.pointLight.position1);

            const light2WorldPositionAttribute = gl.getUniformLocation(glProgram, "light2WorldPosition");
            gl.uniform3fv(light2WorldPositionAttribute, lightParameters.pointLight.position2);

            // Normal map
            let usesNormalMapAttribute = gl.getUniformLocation(glProgram, "usesNormalMap");
            gl.uniform1i(usesNormalMapAttribute, this.normalMap != null);

            if (this.normalMap) {
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, this.normalMap);
                gl.uniform1i(gl.getUniformLocation(glProgram, "uSamplerNormal"), 1);
            }

            // Index buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            
            gl.drawElements(this.drawMode, this.indexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
        }

        this.children.forEach(child => child.draw(gl, glMatrix, glProgram, matrix, viewMatrix, projMatrix, lightParameters));
    }
}
