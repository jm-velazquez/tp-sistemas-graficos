const SPEED_FACTOR = 0.005;
const ZOOM_FACTOR = 25;

const MIN_RADIUS = 100;
const MAX_RADIUS = 1000;

export class OrbitalCamera {
	constructor(glMatrix) {
        this.radius = 500;
        this.alpha = Math.PI / 2;
        this.beta = Math.PI / 2;
        this.currentPosition = { x: 0, y: 0 };
        this.previousPosition = { x: 0, y: 0 };
		this.isMouseButtonPressed = false;
		this.center = glMatrix.vec4.fromValues(0,0,0);
		this.up = glMatrix.vec4.fromValues(0,0,1);
    }

	zoomIn() {
        this.radius = Math.max(MIN_RADIUS, this.radius - ZOOM_FACTOR);
    }

    zoomOut() {
        this.radius = Math.min(MAX_RADIUS, this.radius + ZOOM_FACTOR);
    }

	handleMouseMove(event) {
		if (this.isMouseButtonPressed) {
			this.currentPosition.x = event.clientX || event.pageX;
			this.currentPosition.y = event.clientY || event.pageY;
		}
    }

	handleMouseWheel(event) {
		if (event.deltaY > 0) this.zoomOut();
		else if (event.deltaY < 0) this.zoomIn();
	}

	handleMouseDown(event) {
		if (event.button === 0) {
			this.previousPosition.x = event.clientX || event.pageX;
			this.previousPosition.y = event.clientY || event.pageY;
			this.currentPosition.x = this.previousPosition.x;
			this.currentPosition.y = this.previousPosition.y;
			this.isMouseButtonPressed = true;
		}
	}

	handleMouseUp(event) {
		if (event.button === 0) {
			this.isMouseButtonPressed = false;
		}
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
		glMatrix.mat4.lookAt(viewMatrix, origin, this.center, this.up);

		return viewMatrix;
	}
}
