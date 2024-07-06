import { vec4 } from 'gl-matrix'
import { Shape } from './shape'

export class Rectangle implements Shape {
    width: number
    height: number
    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    getArrays() {
        const positionArray = []
        const normalArray = []
        const uvArray = []

        positionArray.push(
            vec4.fromValues(-this.width / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, -1, 0, 1))
        uvArray.push(0, 0)

        positionArray.push(
            vec4.fromValues(this.width / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, -1, 0, 1))
        uvArray.push(1, 0)

        positionArray.push(
            vec4.fromValues(this.width / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(1, 0, 0, 1))
        uvArray.push(1, 0)

        positionArray.push(
            vec4.fromValues(this.width / 2, this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(1, 0, 0, 1))
        uvArray.push(1, 1)

        positionArray.push(
            vec4.fromValues(this.width / 2, this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, 1, 0, 1))
        uvArray.push(1, 1)

        positionArray.push(
            vec4.fromValues(-this.width / 2, this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(0, 1, 0, 1))
        uvArray.push(0, 1)

        positionArray.push(
            vec4.fromValues(-this.width / 2, this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(-1, 0, 0, 1))
        uvArray.push(0, 1)

        positionArray.push(
            vec4.fromValues(-this.width / 2, -this.height / 2, 0, 1)
        )
        normalArray.push(vec4.fromValues(-1, 0, 0, 1))
        uvArray.push(0, 0)

        return { positionArray, normalArray, uvArray }
    }
}
