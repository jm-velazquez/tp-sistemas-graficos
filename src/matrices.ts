import { mat4 } from "gl-matrix"

export class Matrices {
    public modelMatrix: mat4
    public viewMatrix: mat4
    public projMatrix: mat4

    constructor() {
        this.modelMatrix = mat4.create()
        this.viewMatrix = mat4.create()
        this.projMatrix = mat4.create()

        mat4.identity(this.modelMatrix)
    }

    setUpPerspectiveByDimensions(width: number, height: number) {
        mat4.perspective(
            this.projMatrix,
            45,
            width / height,
            0.1,
            Infinity
        )
    }
}