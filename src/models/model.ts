import { mat4, vec3, vec4 } from 'gl-matrix'
import { LightParameters } from '../scene-parameters'

export class Model {
    positionBuffer: WebGLBuffer | null
    normalBuffer: WebGLBuffer | null
    uvBuffer: WebGLBuffer | null
    indexBuffer: any | null

    texture: WebGLTexture | null
    affectedByLighting: boolean

    children: Model[]
    modelMatrix = mat4.create()

    translationVector = vec3.fromValues(0, 0, 0)
    rotationAxis = vec3.fromValues(1, 0, 0)
    rotationDegree = 0
    scalingVector = vec3.fromValues(1, 1, 1)

    drawMode?: GLenum

    constructor(
        drawMode?: GLenum,
        positionBuffer?: WebGLBuffer | null,
        normalBuffer?: WebGLBuffer | null,
        indexBuffer?: vec4[],
        uvBuffer?: WebGLBuffer | null,
        texture?: WebGLTexture,
        affectedByLighting = true
    ) {
        this.children = []
        this.drawMode = drawMode
        this.positionBuffer = positionBuffer ? positionBuffer : null
        this.normalBuffer = normalBuffer ? normalBuffer : null
        this.indexBuffer = indexBuffer
        this.uvBuffer = uvBuffer ? uvBuffer : null
        this.texture = texture ? texture : null
        this.affectedByLighting = affectedByLighting
        mat4.identity(this.modelMatrix)
    }

    addChild(child: Model) {
        this.children.push(child)
    }

    updateModelMatrix() {
        mat4.translate(
            this.modelMatrix,
            this.modelMatrix,
            this.translationVector
        )
        mat4.rotate(
            this.modelMatrix,
            this.modelMatrix,
            this.rotationDegree,
            this.rotationAxis
        )
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scalingVector)
    }

    draw(
        gl: WebGLRenderingContext,
        glProgram: WebGLProgram,
        parentMatrix: mat4,
        viewMatrix: mat4,
        projMatrix: mat4,
        lightParameters: LightParameters, 
    ) {
        this.updateModelMatrix()
        const matrix = mat4.create()
        mat4.multiply(matrix, parentMatrix, this.modelMatrix)

        if (
            this.drawMode &&
            this.positionBuffer &&
            this.normalBuffer &&
            this.indexBuffer
        ) {
            const normalMatrix = mat4.clone(matrix)
            mat4.invert(normalMatrix, normalMatrix)
            mat4.transpose(normalMatrix, normalMatrix)

            const modelMatrixUniform = gl.getUniformLocation(
                glProgram,
                'modelMatrix'
            )
            const viewMatrixUniform = gl.getUniformLocation(
                glProgram,
                'viewMatrix'
            )
            const projMatrixUniform = gl.getUniformLocation(
                glProgram,
                'projMatrix'
            )
            const normalMatrixUniform = gl.getUniformLocation(
                glProgram,
                'normalMatrix'
            )

            gl.uniformMatrix4fv(modelMatrixUniform, false, matrix)
            gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix)
            gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix)
            gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix)

            // Buffers
            const vertexPositionAttribute = gl.getAttribLocation(
                glProgram,
                'aVertexPosition'
            )
            gl.enableVertexAttribArray(vertexPositionAttribute)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
            gl.vertexAttribPointer(
                vertexPositionAttribute,
                3,
                gl.FLOAT,
                false,
                0,
                0
            )

            const vertexNormalAttribute = gl.getAttribLocation(
                glProgram,
                'aVertexNormal'
            )
            gl.enableVertexAttribArray(vertexNormalAttribute)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
            gl.vertexAttribPointer(
                vertexNormalAttribute,
                3,
                gl.FLOAT,
                false,
                0,
                0
            )

            const uvCoordsAttribute = gl.getAttribLocation(
                glProgram,
                'aTextureCoord'
            )
            gl.enableVertexAttribArray(uvCoordsAttribute)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
            gl.vertexAttribPointer(uvCoordsAttribute, 2, gl.FLOAT, false, 0, 0)

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, this.texture)
            gl.uniform1i(gl.getUniformLocation(glProgram, 'uSampler'), 0)

            // For skybox
            const affectedByLightingAttribute = gl.getUniformLocation(
                glProgram,
                'affectedByLighting'
            )
            gl.uniform1i(
                affectedByLightingAttribute,
                this.affectedByLighting ? 1 : 0
            )

            // Ambient lighting
            const ambientTopColorAttribute = gl.getUniformLocation(
                glProgram,
                'ambientTopColor'
            )
            gl.uniform3fv(
                ambientTopColorAttribute,
                lightParameters.ambientLight.topColor
            )

            const ambientBottomColorAttribute = gl.getUniformLocation(
                glProgram,
                'ambientBottomColor'
            )
            gl.uniform3fv(
                ambientBottomColorAttribute,
                lightParameters.ambientLight.bottomColor
            )

            const ambientLightStrengthAttribute = gl.getUniformLocation(
                glProgram,
                'ambientLightStrength'
            )
            gl.uniform1f(
                ambientLightStrengthAttribute,
                lightParameters.ambientLight.strength
            )

            // Directional lighting
            const directionalLightColorAttribute = gl.getUniformLocation(
                glProgram,
                'directionalLightColor'
            )
            gl.uniform3fv(
                directionalLightColorAttribute,
                lightParameters.directionalLight.color
            )

            const directionalLightVectorAttribute = gl.getUniformLocation(
                glProgram,
                'directionalLightVector'
            )
            gl.uniform3fv(
                directionalLightVectorAttribute,
                lightParameters.directionalLight.direction
            )

            const directionalLightStrengthAttribute = gl.getUniformLocation(
                glProgram,
                'directionalLightStrength'
            )
            gl.uniform1f(
                directionalLightStrengthAttribute,
                lightParameters.directionalLight.strength
            )

            // Point lighting
            const pointLightColorAttribute = gl.getUniformLocation(
                glProgram,
                'pointLightColor'
            )
            gl.uniform3fv(
                pointLightColorAttribute,
                lightParameters.pointLight.color
            )

            const pointLightStrengthAttribute = gl.getUniformLocation(
                glProgram,
                'pointLightStrength'
            )
            gl.uniform1f(
                pointLightStrengthAttribute,
                lightParameters.pointLight.strength
            )

            const light1WorldPositionAttribute = gl.getUniformLocation(
                glProgram,
                'light1WorldPosition'
            )
            gl.uniform3fv(
                light1WorldPositionAttribute,
                lightParameters.pointLight.position1
            )

            const light2WorldPositionAttribute = gl.getUniformLocation(
                glProgram,
                'light2WorldPosition'
            )
            gl.uniform3fv(
                light2WorldPositionAttribute,
                lightParameters.pointLight.position2
            )
            
            // Index buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

            gl.drawElements(
                this.drawMode,
                this.indexBuffer.number_vertex_point,
                gl.UNSIGNED_SHORT,
                0
            )
        }

        this.children.forEach((child) =>
            child.draw(
                gl,
                glProgram,
                matrix,
                viewMatrix,
                projMatrix,
                lightParameters
            )
        )
    }
}
