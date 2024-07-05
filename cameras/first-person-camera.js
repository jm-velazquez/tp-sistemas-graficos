const PLAYER_HEIGHT = 2;
const WALKING_VELOCITY = 0.3;
const RUNNING_VELOCITY = 0.7;
const SENSITIVITY = 0.01;

export class FirstPersonCamera {
    playerPosition;
    targetPosition;
    alpha = 0;
    beta = 0;
	currentPosition = {x: 0, y: 0};
	previousPosition = {x: 0, y: 0};

    constructor(glMatrix, startingPosition) {
        this.playerPosition = glMatrix.vec3.fromValues(
            startingPosition[0],
            startingPosition[1],
            startingPosition[2] + PLAYER_HEIGHT);
        this.lookAround(glMatrix, 0, 0);
        this.isMouseButtonPressed = false;
    }

    getMatrix(glMatrix) {
		const deltaX = this.currentPosition.x - this.previousPosition.x;
		const deltaY = this.currentPosition.y - this.previousPosition.y;
		
		this.previousPosition.x = this.currentPosition.x;
		this.previousPosition.y = this.currentPosition.y;

        this.lookAround(glMatrix, deltaX, deltaY);

        const matrix = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(matrix, this.playerPosition, this.targetPosition, [0,0,1]);
        return matrix;
    }

    getPlayerForwardDirection(glMatrix) {
        const forwardDirection = glMatrix.vec3.fromValues(
            this.targetPosition[0] - this.playerPosition[0],
            this.targetPosition[1] - this.playerPosition[1],
            0,
        );
        glMatrix.vec3.normalize(forwardDirection, forwardDirection);
        return forwardDirection;
    }

    getPlayerRightDirection(glMatrix) {
        const forwardDirection = this.getPlayerForwardDirection(glMatrix);
        const rightDirection = glMatrix.vec3.create();
        glMatrix.vec3.rotateZ(rightDirection, forwardDirection, [0,0,0], - Math.PI / 2);
        return rightDirection;
    }

    moveInDirection(glMatrix, direction, running) {
        const velocity = running ? RUNNING_VELOCITY : WALKING_VELOCITY;
        glMatrix.vec3.scale(direction, direction, velocity);
        glMatrix.vec3.add(this.playerPosition, this.playerPosition, direction);
        glMatrix.vec3.add(this.targetPosition, this.targetPosition, direction);
    }

    moveForward(glMatrix, running) {
        const forwardDirection = this.getPlayerForwardDirection(glMatrix);
        this.moveInDirection(glMatrix, forwardDirection, running);
    }

    moveBackwards(glMatrix, running) {
        const forwardDirection = this.getPlayerForwardDirection(glMatrix);
        const backwardsDirection = glMatrix.vec3.create();
        glMatrix.vec3.scale(backwardsDirection, forwardDirection, -1);
        this.moveInDirection(glMatrix, backwardsDirection, running);
    }

    moveRight(glMatrix, running) {
        const rightDirection = this.getPlayerRightDirection(glMatrix);
        this.moveInDirection(glMatrix, rightDirection, running);
    }

    moveLeft(glMatrix, running) {
        const rightDirection = this.getPlayerRightDirection(glMatrix);
        const leftDirection = glMatrix.vec3.create();
        glMatrix.vec3.scale(leftDirection, rightDirection, -1);
        this.moveInDirection(glMatrix, leftDirection, running);
    }

    lookAround(glMatrix, deltaX, deltaY) {
        this.alpha -= SENSITIVITY * deltaX;
        this.beta -=  SENSITIVITY * deltaY;
        if (this.beta > Math.PI / 2) this.beta = Math.PI / 2;
        else if (this.beta < - Math.PI / 2 + 0.01) this.beta = - Math.PI / 2 + 0.01;

        const newTargetPosition = glMatrix.vec3.fromValues(0,10,0);
        glMatrix.vec3.rotateX(newTargetPosition, newTargetPosition, [0, 0, 0], this.beta);
        glMatrix.vec3.rotateZ(newTargetPosition, newTargetPosition, [0, 0, 0], this.alpha);
        glMatrix.vec3.add(newTargetPosition, newTargetPosition, this.playerPosition);
        this.targetPosition = newTargetPosition;
    }

	handleMouseMove(event) {
        if (this.isMouseButtonPressed) {
            this.currentPosition.x = event.clientX || event.pageX;
		    this.currentPosition.y = event.clientY || event.pageY;
        }
	}

    handleMouseDown(event) {
		if (event.button === 0) {
			this.isMouseButtonPressed = true;
            this.previousPosition.x = event.clientX || event.pageX;
			this.previousPosition.y = event.clientY || event.pageY;
			this.currentPosition.x = this.previousPosition.x;
			this.currentPosition.y = this.previousPosition.y;
		}
	}

	handleMouseUp(event) {
		if (event.button === 0) {
			this.isMouseButtonPressed = false;
		}
	}
}