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
		this.addCornerVertices(side / 2 - cornerRadius, - side / 2 + cornerRadius, Math.PI * (3 / 2));
		// Uper right corner
		this.addCornerVertices(side / 2 - cornerRadius, side / 2 - cornerRadius, 0);
		// Upper left corner
		this.addCornerVertices(- side / 2 + cornerRadius, side / 2 - cornerRadius, Math.PI / 2);
		// Lower left corner
		this.addCornerVertices(- side / 2 + cornerRadius, - side / 2 + cornerRadius, Math.PI);
		// Closes the shape (by repeating the first vertex)
		this.positionArray.push(glMatrix.vec4.fromValues(side / 2 - cornerRadius, - side / 2, 0, 1));
		this.normalArray.push(glMatrix.vec4.fromValues(0, -1, 0, 1));
		this.uvArray.push(
			(2 * (side / 2 - cornerRadius) / side + side) * uvMultiplier,
			(- side / 2) / side + side * uvMultiplier,
		);
	}

	addCornerVertices(xOffset, yOffset, phi) {
		for (let i = 0; i <= CORNER_DEFINITION; i++) {
			const alpha = (i / CORNER_DEFINITION) * (Math.PI / 2);
			const xCorner = Math.cos(phi + alpha);
			const yCorner = Math.sin(phi + alpha);
			const x = xOffset + this.cornerRadius * xCorner;
			const y = yOffset + this.cornerRadius * yCorner;
			this.positionArray.push(glMatrix.vec4.fromValues(x, y, 0, 1));
			this.normalArray.push(glMatrix.vec4.fromValues(xCorner, yCorner, 0, 1));
			this.uvArray.push(2 * x / this.side + this.side, 2 * y / this.side + this.side);
		}
	}

	getArrays() {
		return {positionArray: this.positionArray, normalArray: this.normalArray, uvArray: this.uvArray};
	}
}
