export class Circle {
	radius = 0;
	constructor(radius = 1) {
		this.radius = radius;
	}

	getPosition(u) {
		const alpha = u * 2 * Math.PI;
		const x = this.radius * Math.cos(alpha);
		const y = this.radius * Math.sin(alpha);
		return glMatrix.vec4.fromValues(x, y, 0, 1);
	}

	getPositionAndNormalArrays(amountOfPoints) {
		const increment = 1 / amountOfPoints;
		const positionArray = [];
		for (let i = 0; i <= amountOfPoints; i++) {
			positionArray.push(this.getPosition(i * increment));
		}
		return {positionArray, normalArray: positionArray};
	}
}