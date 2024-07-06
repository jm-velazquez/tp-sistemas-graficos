const SPEED_FACTOR = 0.005
const ZOOM_FACTOR = 25

const MIN_RADIUS = 100
const MAX_RADIUS = 1000

import { vec4, mat4, vec2, vec3 } from 'gl-matrix'

export class OrbitalCamera {
    radius: number
    alpha: number
    beta: number
    currentPosition: vec2
    previousPosition: vec2
    isMouseButtonPressed: boolean
    center: vec3
    up: vec3
    keysPressed: {
        plus: boolean
        minus: boolean
    }

    constructor() {
        this.radius = 500
        this.alpha = Math.PI / 2
        this.beta = Math.PI / 2
        this.currentPosition = vec2.create()
        this.previousPosition = vec2.create()
        this.isMouseButtonPressed = false
        this.center = vec3.fromValues(0, 0, 0)
        this.up = vec3.fromValues(0, 0, 1)
        this.keysPressed = {
            plus: false,
            minus: false,
        }
    }

    zoomIn() {
        this.radius = Math.max(MIN_RADIUS, this.radius - ZOOM_FACTOR)
    }

    zoomOut() {
        this.radius = Math.min(MAX_RADIUS, this.radius + ZOOM_FACTOR)
    }

    handleMouseMove(event: MouseEvent) {
        if (this.isMouseButtonPressed) {
            this.currentPosition = vec2.fromValues(
                event.clientX || event.pageX,
                event.clientY || event.pageY
            )
        }
    }

    handleMouseWheel(event: WheelEvent) {
        if (event.deltaY > 0) this.zoomOut()
        else if (event.deltaY < 0) this.zoomIn()
    }

    handleMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            this.previousPosition = vec2.fromValues(
                event.clientX || event.pageX,
                event.clientY || event.pageY
            )
            this.currentPosition = this.previousPosition
            this.isMouseButtonPressed = true
        }
    }

    handleMouseUp(event: MouseEvent) {
        if (event.button === 0) {
            this.isMouseButtonPressed = false
        }
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.key === '=') this.keysPressed.plus = true
        else if (event.key === '-') this.keysPressed.minus = true
    }

    handleKeyUp(event: KeyboardEvent) {
        if (event.key === '=') this.keysPressed.plus = false
        else if (event.key === '-') this.keysPressed.minus = false
    }

    getMatrix() {
        const delta = vec2.create()
        vec2.sub(delta, this.currentPosition, this.previousPosition)
        this.previousPosition = this.currentPosition

        this.alpha = this.alpha - delta[0] * SPEED_FACTOR
        this.beta = this.beta - delta[1] * SPEED_FACTOR

        if (this.beta < 0.01) this.beta = 0.01
        if (this.beta > Math.PI / 2) this.beta = Math.PI / 2

        const origin = vec3.fromValues(
            this.radius * Math.cos(this.alpha) * Math.sin(this.beta),
            this.radius * Math.sin(this.alpha) * Math.sin(this.beta),
            this.radius * Math.cos(this.beta)
        )

        const viewMatrix = mat4.create()
        mat4.lookAt(viewMatrix, origin, this.center, this.up)

        return viewMatrix
    }

    animate() {
        if (this.keysPressed.plus) this.zoomIn()
        else if (this.keysPressed.minus) this.zoomOut()
        return this.getMatrix()
    }
}
