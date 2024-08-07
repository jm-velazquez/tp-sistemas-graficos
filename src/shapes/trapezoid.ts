import { mat4, vec2, vec4 } from 'gl-matrix'

export class Trapezoid {
    base: number
    top: number
    height: number
    constructor(base: number, top: number, height: number) {
        this.base = base
        this.top = top
        this.height = height
    }

    getArrays() {
        const positionArray: vec4[] = []
        const normalArray: vec4[] = []
        const uvArray: vec2[] = []

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
        uvArray.push(vec2.fromValues(0, 0))

        positionArray.push(
            vec4.fromValues(this.base / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, -1, 0, 1))
        uvArray.push(vec2.fromValues(1, 0))

        positionArray.push(
            vec4.fromValues(this.base / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(rightSideNormal)
        uvArray.push(vec2.fromValues(1, 0))

        positionArray.push(vec4.fromValues(this.top / 2, this.height / 2, 0, 1))
        normalArray.push(rightSideNormal)
        uvArray.push(vec2.fromValues(1 - normalizedDiff, 1))

        positionArray.push(vec4.fromValues(this.top / 2, this.height / 2, 0, 1))
        normalArray.push(vec4.fromValues(0, 1, 0, 1))
        uvArray.push(vec2.fromValues(1 - normalizedDiff, 1))

        positionArray.push(
            vec4.fromValues(-this.top / 2, this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, 1, 0, 1))
        uvArray.push(vec2.fromValues(normalizedDiff, 1))

        positionArray.push(
            vec4.fromValues(-this.top / 2, this.height / 2, 0, 1)
        )
        normalArray.push(leftSideNormal)
        uvArray.push(vec2.fromValues(normalizedDiff, 1))

        positionArray.push(
            vec4.fromValues(-this.base / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(leftSideNormal)
        uvArray.push(vec2.fromValues(0, 0))

        return { positionArray, normalArray, uvArray }
    }
}
