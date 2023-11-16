export class QuarterCircle {
	radius = 0;
	constructor(radius = 1) {
		this.radius = radius;
	}

	getPosition(u) {
		const alpha = u * Math.PI / 2;
		const x = this.radius * Math.cos(alpha);
		const y = this.radius * Math.sin(alpha);
		return glMatrix.vec4.fromValues(x, y, 0, 1);
	}

	getPositionAndNormalArrays(amountOfPoints) {
		const increment = 1 / amountOfPoints;
		const positionArray = [];
		const normalArray = [];
		for (let i = 0; i <= amountOfPoints; i++) {
			const position = this.getPosition(i * increment);
			const normal = glMatrix.vec4.create();
			glMatrix.vec4.normalize(normal, position);
			positionArray.push(position);
			normalArray.push(normal);
		}
		return {positionArray, normalArray};
	}
}