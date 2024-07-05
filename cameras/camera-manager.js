import { OrbitalCamera } from "/cameras/orbital-camera.js";
import { FirstPersonCamera } from "/cameras/first-person-camera.js";

export class CameraManager {
    constructor(glMatrix) {
        this.orbitalCamera = new OrbitalCamera(glMatrix);
        this.streetCamera = new FirstPersonCamera(glMatrix, [0,0,0]);
        this.highwayCamera = new FirstPersonCamera(glMatrix, [0,0,32]);
        this.cameraMode = "orbital";
        this.keysPressed = {
            plus: false,
            minus: false,
            w: false,
            a: false,
            s: false,
            d: false,
            shift: false,
        }

        let canvas = document.getElementById("my-canvas");

        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
        canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }

    handleMouseDown = (event) => {
        this.orbitalCamera.handleMouseDown(event);
        this.streetCamera.handleMouseDown(event);
        this.highwayCamera.handleMouseDown(event);
    }

    handleMouseUp = (event) => {
        this.orbitalCamera.handleMouseUp(event);
        this.streetCamera.handleMouseUp(event);
        this.highwayCamera.handleMouseUp(event);
    }

    handleKeyDown = (event) => {
        if (event.key === "=") this.keysPressed.plus = true;
        else if (event.key === "-") this.keysPressed.minus = true;
        else if (event.key === "w") this.keysPressed.w = true;
        else if (event.key === "s") this.keysPressed.s = true;
        else if (event.key === "a") this.keysPressed.a = true;
        else if (event.key === "d") this.keysPressed.d = true;
        else if (event.key === "1") this.cameraMode = "orbital";
        else if (event.key === "2") this.cameraMode = "street";
        else if (event.key === "3") this.cameraMode = "highway";
        if (event.shiftKey) this.keysPressed.shift = true;
    }

    handleKeyUp = (event) => {
        if (event.key === "=") this.keysPressed.plus = false;
        else if (event.key === "-") this.keysPressed.minus = false;
        else if (event.key === "w") this.keysPressed.w = false;
        else if (event.key === "s") this.keysPressed.s = false;
        else if (event.key === "a") this.keysPressed.a = false;
        else if (event.key === "d") this.keysPressed.d = false;
        if (!event.shiftKey) this.keysPressed.shift = false;
    }

    handleMouseWheel = (event) => {
        if (this.cameraMode === "orbital") {
            if (event.deltaY > 0) this.orbitalCamera.zoomOut();
            else if (event.deltaY < 0) this.orbitalCamera.zoomIn();
        }
    }

    handleMouseMove = (event) => {
        this.orbitalCamera.handleMouseMove(event);
        this.streetCamera.handleMouseMove(event);
        this.highwayCamera.handleMouseMove(event);
    }

    animate(glMatrix) {
        if (this.cameraMode === "orbital") {
            if (this.keysPressed.plus) this.orbitalCamera.zoomIn();
            else if (this.keysPressed.minus) this.orbitalCamera.zoomOut();
            return this.orbitalCamera.getMatrix(glMatrix);
        } else if (this.cameraMode === "street") {
            const running = this.keysPressed.shift;
            if (this.keysPressed.w) this.streetCamera.moveForward(glMatrix, running);
            if (this.keysPressed.a) this.streetCamera.moveLeft(glMatrix, running);
            if (this.keysPressed.s) this.streetCamera.moveBackwards(glMatrix, running);
            if (this.keysPressed.d) this.streetCamera.moveRight(glMatrix, running);
            return this.streetCamera.getMatrix(glMatrix);   
        } else {
            const running = this.keysPressed.shift;
            if (this.keysPressed.w) this.highwayCamera.moveForward(glMatrix, running);
            if (this.keysPressed.a) this.highwayCamera.moveLeft(glMatrix, running);
            if (this.keysPressed.s) this.highwayCamera.moveBackwards(glMatrix, running);
            if (this.keysPressed.d) this.highwayCamera.moveRight(glMatrix, running);
            return this.highwayCamera.getMatrix(glMatrix);  
        }
    }
}