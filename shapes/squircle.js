const CORNER_DEFINITION = 4;

export class Squircle {
	side;
	cornerRadius;

	positionArray = [];
	normalArray = [];
	uvArray = [];

	constructor(side, cornerRadius, uvMultiplier) {
		this.side = side;
		this.cornerRadius = cornerRadius;
		// Lower right corner
		this.addCornerVertices(side / 2 - cornerRadius, - side / 2 + cornerRadius, Math.PI * (3 / 2), uvMultiplier);
		// Uper right corner
		this.addCornerVertices(side / 2 - cornerRadius, side / 2 - cornerRadius, 0, uvMultiplier);
		// Upper left corner
		this.addCornerVertices(- side / 2 + cornerRadius, side / 2 - cornerRadius, Math.PI / 2, uvMultiplier);
		// Lower left corner
		this.addCornerVertices(- side / 2 + cornerRadius, - side / 2 + cornerRadius, Math.PI, uvMultiplier);
		// Closes the shape (by repeating the first vertex)
		this.positionArray.push(glMatrix.vec4.fromValues(side / 2 - cornerRadius, - side / 2, 0, 1));
		this.normalArray.push(glMatrix.vec4.fromValues(0, -1, 0, 1));
		this.uvArray.push(
			- 2 * (side / 2 - cornerRadius) / this.side * uvMultiplier + 1,
			- 2 * (- side / 2) / this.side * uvMultiplier );
	}

	addCornerVertices(xOffset, yOffset, phi, uvMultiplier) {
		for (let i = 0; i <= CORNER_DEFINITION; i++) {
			const alpha = (i / CORNER_DEFINITION) * (Math.PI / 2);
			const xCorner = Math.cos(phi + alpha);
			const yCorner = Math.sin(phi + alpha);
			const x = xOffset + this.cornerRadius * xCorner;
			const y = yOffset + this.cornerRadius * yCorner;
			this.positionArray.push(glMatrix.vec4.fromValues(x, y, 0, 1));
			this.normalArray.push(glMatrix.vec4.fromValues(xCorner, yCorner, 0, 1));
			this.uvArray.push(- 2 * x / this.side * uvMultiplier + 1, - 2 * y / this.side * uvMultiplier );
		}
	}

	getArrays() {
		return {positionArray: this.positionArray, normalArray: this.normalArray, uvArray: this.uvArray};
	}
}
