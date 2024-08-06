import { vec2, vec4 } from 'gl-matrix'

export interface Shape {
    getArrays(): {
        positionArray: vec4[]
        normalArray: vec4[]
        uvArray: vec2[]
    }
}
