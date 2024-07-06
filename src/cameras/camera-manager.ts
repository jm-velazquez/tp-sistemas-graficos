import { OrbitalCamera } from './orbital-camera'
import { FirstPersonCamera } from './first-person-camera'
import { Camera } from './camera'

export class CameraManager {
    orbitalCamera: OrbitalCamera
    streetCamera: FirstPersonCamera
    highwayCamera: FirstPersonCamera
    selectedCamera: Camera

    constructor() {
        this.orbitalCamera = new OrbitalCamera()
        this.streetCamera = new FirstPersonCamera([0, 0, 0])
        this.highwayCamera = new FirstPersonCamera([0, 0, 32])
        this.selectedCamera = this.orbitalCamera

        let canvas = document.getElementById('my-canvas')!

        window.addEventListener('keydown', this.handleKeyDown.bind(this))
        window.addEventListener('keyup', this.handleKeyUp.bind(this))
        canvas.addEventListener('wheel', this.handleMouseWheel.bind(this))
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
        window.addEventListener('mousemove', this.handleMouseMove.bind(this))
    }

    handleMouseDown = (event: MouseEvent) => {
        this.selectedCamera.handleMouseDown(event)
    }

    handleMouseUp = (event: MouseEvent) => {
        this.selectedCamera.handleMouseUp(event)
    }

    handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === '1') this.selectedCamera = this.orbitalCamera
        else if (event.key === '2') this.selectedCamera = this.streetCamera
        else if (event.key === '3') this.selectedCamera = this.highwayCamera
        else {
            this.selectedCamera.handleKeyDown(event)
        }
    }

    handleKeyUp = (event: KeyboardEvent) => {
        this.selectedCamera.handleKeyUp(event)
    }

    handleMouseWheel = (event: WheelEvent) => {
        this.selectedCamera.handleMouseWheel(event)
    }

    handleMouseMove = (event: MouseEvent) => {
        this.selectedCamera.handleMouseMove(event)
    }

    animate() {
        return this.selectedCamera.animate()
    }
}
