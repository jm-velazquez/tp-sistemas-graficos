const PLAYER_HEIGHT = 2
const WALKING_VELOCITY = 0.3
const RUNNING_VELOCITY = 0.7
const SENSITIVITY = 0.01

import { vec3, mat4 } from 'gl-matrix'
import { Camera } from './camera'

export class FirstPersonCamera implements Camera {
    playerPosition: vec3
    targetPosition: vec3
    alpha = 0
    beta = 0
    currentPosition = { x: 0, y: 0 }
    previousPosition = { x: 0, y: 0 }
    isMouseButtonPressed: boolean
    keysPressed: {
        w: boolean
        a: boolean
        s: boolean
        d: boolean
        shift: boolean
    }

    constructor(startingPosition: vec3) {
        this.targetPosition = vec3.create()
        this.playerPosition = vec3.fromValues(
            startingPosition[0],
            startingPosition[1],
            startingPosition[2] + PLAYER_HEIGHT
        )
        this.lookAround(0, 0)
        this.isMouseButtonPressed = false
        this.keysPressed = {
            w: false,
            a: false,
            s: false,
            d: false,
            shift: false,
        }
    }

    getMatrix() {
        const deltaX = this.currentPosition.x - this.previousPosition.x
        const deltaY = this.currentPosition.y - this.previousPosition.y

        this.previousPosition.x = this.currentPosition.x
        this.previousPosition.y = this.currentPosition.y

        this.lookAround(deltaX, deltaY)

        const matrix = mat4.create()
        mat4.lookAt(matrix, this.playerPosition, this.targetPosition, [0, 0, 1])
        return matrix
    }

    getPlayerForwardDirection() {
        const forwardDirection = vec3.fromValues(
            this.targetPosition[0] - this.playerPosition[0],
            this.targetPosition[1] - this.playerPosition[1],
            0
        )
        vec3.normalize(forwardDirection, forwardDirection)
        return forwardDirection
    }

    getPlayerRightDirection() {
        const forwardDirection = this.getPlayerForwardDirection()
        const rightDirection = vec3.create()
        vec3.rotateZ(rightDirection, forwardDirection, [0, 0, 0], -Math.PI / 2)
        return rightDirection
    }

    moveInDirection(direction: vec3, running: boolean) {
        const velocity = running ? RUNNING_VELOCITY : WALKING_VELOCITY
        vec3.scale(direction, direction, velocity)
        vec3.add(this.playerPosition, this.playerPosition, direction)
        vec3.add(this.targetPosition, this.targetPosition, direction)
    }

    moveForward(running: boolean) {
        const forwardDirection = this.getPlayerForwardDirection()
        this.moveInDirection(forwardDirection, running)
    }

    moveBackwards(running: boolean) {
        const forwardDirection = this.getPlayerForwardDirection()
        const backwardsDirection = vec3.create()
        vec3.scale(backwardsDirection, forwardDirection, -1)
        this.moveInDirection(backwardsDirection, running)
    }

    moveRight(running: boolean) {
        const rightDirection = this.getPlayerRightDirection()
        this.moveInDirection(rightDirection, running)
    }

    moveLeft(running: boolean) {
        const rightDirection = this.getPlayerRightDirection()
        const leftDirection = vec3.create()
        vec3.scale(leftDirection, rightDirection, -1)
        this.moveInDirection(leftDirection, running)
    }

    lookAround(deltaX: number, deltaY: number) {
        this.alpha -= SENSITIVITY * deltaX
        this.beta -= SENSITIVITY * deltaY
        if (this.beta > Math.PI / 2) this.beta = Math.PI / 2
        else if (this.beta < -Math.PI / 2 + 0.01)
            this.beta = -Math.PI / 2 + 0.01

        const newTargetPosition = vec3.fromValues(0, 10, 0)
        vec3.rotateX(newTargetPosition, newTargetPosition, [0, 0, 0], this.beta)
        vec3.rotateZ(
            newTargetPosition,
            newTargetPosition,
            [0, 0, 0],
            this.alpha
        )
        vec3.add(newTargetPosition, newTargetPosition, this.playerPosition)
        this.targetPosition = newTargetPosition
    }

    handleMouseMove(event: MouseEvent) {
        if (this.isMouseButtonPressed) {
            this.currentPosition.x = event.clientX || event.pageX
            this.currentPosition.y = event.clientY || event.pageY
        }
    }

    handleMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            this.isMouseButtonPressed = true
            this.previousPosition.x = event.clientX || event.pageX
            this.previousPosition.y = event.clientY || event.pageY
            this.currentPosition.x = this.previousPosition.x
            this.currentPosition.y = this.previousPosition.y
        }
    }

    handleMouseUp(event: MouseEvent) {
        if (event.button === 0) {
            this.isMouseButtonPressed = false
        }
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'w') this.keysPressed.w = true
        else if (event.key === 's') this.keysPressed.s = true
        else if (event.key === 'a') this.keysPressed.a = true
        else if (event.key === 'd') this.keysPressed.d = true
        if (event.shiftKey) this.keysPressed.shift = true
    }

    handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'w') this.keysPressed.w = false
        else if (event.key === 's') this.keysPressed.s = false
        else if (event.key === 'a') this.keysPressed.a = false
        else if (event.key === 'd') this.keysPressed.d = false
        if (!event.shiftKey) this.keysPressed.shift = false
    }

    handleMouseWheel() {}

    animate() {
        const running = this.keysPressed.shift
        if (this.keysPressed.w) this.moveForward(running)
        if (this.keysPressed.a) this.moveLeft(running)
        if (this.keysPressed.s) this.moveBackwards(running)
        if (this.keysPressed.d) this.moveRight(running)
        return this.getMatrix()
    }
}
