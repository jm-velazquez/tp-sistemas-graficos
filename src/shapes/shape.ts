import { vec4 } from 'gl-matrix'

export interface Shape {
    getArrays(): {
        positionArray: vec4[]
        normalArray: vec4[]
        uvArray: number[]
    }
}
