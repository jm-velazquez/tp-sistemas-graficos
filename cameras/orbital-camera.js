const SPEED_FACTOR = 0.005;
const ZOOM_FACTOR = 25;
const CENTER = glMatrix.vec4.fromValues(0,0,0);
const UP = glMatrix.vec4.fromValues(0,0,1);

const MIN_RADIUS = 100;
const MAX_RADIUS = 1000;

export class OrbitalCamera {
	constructor() {
        this.radius = 500;
        this.alpha = Math.PI / 2;
        this.beta = Math.PI / 2;
        this.currentPosition = { x: 0, y: 0 };
        this.previousPosition = { x: 0, y: 0 };
    }

	setCurrentPosition(x, y) {
		this.currentPosition.x = x;
		this.currentPosition.y = y;
	}

	zoomIn() {
        this.radius = Math.max(MIN_RADIUS, this.radius - ZOOM_FACTOR);
    }

    zoomOut() {
        this.radius = Math.min(MAX_RADIUS, this.radius + ZOOM_FACTOR);
    }

	getMatrix(glMatrix) {
		const deltaX = this.currentPosition.x - this.previousPosition.x;
		const deltaY = this.currentPosition.y - this.previousPosition.y;
		
		this.previousPosition.x = this.currentPosition.x;
		this.previousPosition.y = this.currentPosition.y;

		this.alpha = this.alpha - deltaX * SPEED_FACTOR;
		this.beta = this.beta - deltaY * SPEED_FACTOR;

		if (this.beta < 0.01) this.beta = 0.01;
		if (this.beta > Math.PI / 2) this.beta = Math.PI / 2;

		const origin = glMatrix.vec4.fromValues(
			this.radius * Math.cos(this.alpha) * Math.sin(this.beta),
			this.radius * Math.sin(this.alpha) * Math.sin(this.beta),
			this.radius * Math.cos(this.beta),
		);
		
		const viewMatrix = glMatrix.mat4.create();
		glMatrix.mat4.lookAt(viewMatrix, origin, CENTER, UP);

		return viewMatrix;
	}
}
