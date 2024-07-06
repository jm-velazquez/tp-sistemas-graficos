import { mat4, vec4 } from 'gl-matrix'

export class Trapezoid {
    base = 0
    top = 0
    height = 0
    constructor(base, top, height) {
        this.base = base
        this.top = top
        this.height = height
    }

    getArrays() {
        const positionArray = []
        const normalArray = []
        const uvArray = []

        const diff = this.base - this.top
        const normalizedDiff = diff / this.base

        const rotateMatrix = mat4.create()
        mat4.identity(rotateMatrix)
        mat4.rotate(
            rotateMatrix,
            rotateMatrix,
            Math.PI / 2 - Math.PI / 4 - Math.atan(this.height / diff),
            [0, 0, 1]
        )
        const rightSideNormal = vec4.fromValues(1, 0, 0, 1)
        vec4.transformMat4(rightSideNormal, rightSideNormal, rotateMatrix)
        const leftSideNormal = vec4.fromValues(
            -rightSideNormal[0],
            rightSideNormal[1],
            0,
            1
        )

        positionArray.push(
            vec4.fromValues(-this.base / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, -1, 0, 1))
        uvArray.push(0, 0)

        positionArray.push(
            vec4.fromValues(this.base / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, -1, 0, 1))
        uvArray.push(1, 0)

        positionArray.push(
            vec4.fromValues(this.base / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(rightSideNormal)
        uvArray.push(1, 0)

        positionArray.push(vec4.fromValues(this.top / 2, this.height / 2, 0, 1))
        normalArray.push(rightSideNormal)
        uvArray.push(1 - normalizedDiff, 1)

        positionArray.push(vec4.fromValues(this.top / 2, this.height / 2, 0, 1))
        normalArray.push(vec4.fromValues(0, 1, 0, 1))
        uvArray.push(1 - normalizedDiff, 1)

        positionArray.push(
            vec4.fromValues(-this.top / 2, this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, 1, 0, 1))
        uvArray.push(normalizedDiff, 1)

        positionArray.push(
            vec4.fromValues(-this.top / 2, this.height / 2, 0, 1)
        )
        normalArray.push(leftSideNormal)
        uvArray.push(normalizedDiff, 1)

        positionArray.push(
            vec4.fromValues(-this.base / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(leftSideNormal)
        uvArray.push(0, 0)

        return { positionArray, normalArray, uvArray }
    }
}
