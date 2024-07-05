import { OrbitalCamera } from "/cameras/orbital-camera.js";
import { FirstPersonCamera } from "/cameras/first-person-camera.js";

export class CameraManager {
  constructor(glMatrix) {
    this.orbitalCamera = new OrbitalCamera(glMatrix);
    this.streetCamera = new FirstPersonCamera(glMatrix, [0, 0, 0]);
    this.highwayCamera = new FirstPersonCamera(glMatrix, [0, 0, 32]);
    this.selectedCamera = this.orbitalCamera;

    let canvas = document.getElementById("my-canvas");

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
    canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  handleMouseDown = (event) => {
    this.selectedCamera.handleMouseDown(event);
  };

  handleMouseUp = (event) => {
    this.selectedCamera.handleMouseUp(event);
  };

  handleKeyDown = (event) => {
    if (event.key === "1") this.selectedCamera = this.orbitalCamera;
    else if (event.key === "2") this.cameraMode = this.streetCamera;
    else if (event.key === "3") this.cameraMode = this.highwayCamera;
    else {
      this.selectedCamera.handleKeyDown(event);
    }
  };

  handleKeyUp = (event) => {
    this.selectedCamera.handleKeyUp(event);
  };

  handleMouseWheel = (event) => {
    this.selectedCamera.handleMouseWheel(event);
  };

  handleMouseMove = (event) => {
    this.selectedCamera.handleMouseMove(event);
  };

  animate(glMatrix) {
    return this.selectedCamera.animate(glMatrix);
  }
}
