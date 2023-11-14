import { Model } from "../model.js";

const SPEED_FACTOR = 5;
const CAMERA_SPEED_FACTOR = 0.1;

export class FirstPersonCamera {
	// Movement
	camera = new Model();
	focus = new Model();
	isMoving = {forward: false, back: false, left: false, right: false};

	// Look around
	currentPositionX = 0;
	previousPositionX = 0;

	constructor(glMatrix, startingPosition) {
		this.focus.translationVector = glMatrix.vec4.fromValues(10, 0, 0, 1);
		this.camera.addChild(this.focus);
		this.camera.translationVector = startingPosition;
		this.camera.rotationAxis = glMatrix.vec4.fromValues(0,0,1,1);
	}

	setMovingForward(isMovingForward) {
		this.isMoving.forward = isMovingForward;
	}

	setMovingBack(isMovingBack) {
		this.isMoving.back = isMovingBack;
	}

	setMovingLeft(isMovingLeft) {
		this.isMoving.left = isMovingLeft;
	}

	setMovingRight(isMovingRight) {
		this.isMoving.right = isMovingRight;
	}

	setCurrentPosition(x, y) {
		this.currentPosition.x = x;
		this.currentPosition.y = y;
	}

	setNewPosition() {
		if (this.isMoving.forward) this.camera.translationVector[1] += SPEED_FACTOR;
		if (this.isMoving.back) this.camera.translationVector[1] -= SPEED_FACTOR;
		if (this.isMoving.left) this.camera.translationVector[0] -= SPEED_FACTOR;
		if (this.isMoving.right) this.camera.translationVector[0] += SPEED_FACTOR;
	}

	getMatrix(glMatrix) {
		this.setNewPosition();
		const deltaX = this.currentPositionX - this.previousPositionX;
		this.previousPositionX = this.currentPositionX;

		this.camera.rotationDegree = this.camera.rotationDegree - deltaX * CAMERA_SPEED_FACTOR;

		const viewMatrix = glMatrix.mat4.create();
		glMatrix.mat4.identity(viewMatrix);
		const worldCoordinates = this.camera.getWorldCoordinates(viewMatrix);
		
		glMatrix.mat4.lookAt(
			viewMatrix,
			worldCoordinates[0],
			worldCoordinates[1],
			glMatrix.vec3.fromValues(0,0,1),
		);

		return viewMatrix;
	}
}