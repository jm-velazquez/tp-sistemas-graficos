const CORNER_DEFINITION = 4;

export class Squircle {
  	side;
	cornerRadius;
	constructor(side, cornerRadius) {
		this.side = side;
		this.cornerRadius = cornerRadius;
	}

	getPositionAndNormalArrays() {
		const positionArray = [];
		const normalArray = [];
		for (let i = 0; i <= CORNER_DEFINITION; i++) {
			const alpha = (i / CORNER_DEFINITION) * (Math.PI / 2);
			const xCorner = Math.cos(Math.PI * (3 / 2) + alpha);
			const yCorner = Math.sin(Math.PI * (3 / 2) + alpha);
			const x = this.side / 2 - this.cornerRadius + this.cornerRadius * xCorner;
			const y = - this.side / 2 + this.cornerRadius + this.cornerRadius * yCorner;
			positionArray.push(glMatrix.vec4.fromValues(x, y, 0, 1));
			normalArray.push(glMatrix.vec4.fromValues(xCorner, yCorner, 0, 1));
		}
		for (let i = 0; i <= CORNER_DEFINITION; i++) {
			const alpha = (i / CORNER_DEFINITION) * (Math.PI / 2);
			const xCorner = Math.cos(alpha);
			const yCorner = Math.sin(alpha);
			const x = this.side / 2 - this.cornerRadius + this.cornerRadius * xCorner;
			const y = this.side / 2 - this.cornerRadius + this.cornerRadius * yCorner;
			positionArray.push(glMatrix.vec4.fromValues(x, y, 0, 1));
			normalArray.push(glMatrix.vec4.fromValues(xCorner,yCorner,0,1));
		}
		for (let i = 0; i <= CORNER_DEFINITION; i++) {
			const alpha = (i / CORNER_DEFINITION) * (Math.PI / 2);
			const xCorner = Math.cos(Math.PI / 2  + alpha);
			const yCorner = Math.sin(Math.PI / 2  + alpha);
			const x = - this.side / 2 + this.cornerRadius + this.cornerRadius * xCorner;
			const y = this.side / 2 - this.cornerRadius + this.cornerRadius * yCorner;
			positionArray.push(glMatrix.vec4.fromValues(x, y, 0, 1));
			normalArray.push(glMatrix.vec4.fromValues(xCorner,yCorner,0,1));
		}
		for (let i = 0; i <= CORNER_DEFINITION; i++) {
			const alpha = (i / CORNER_DEFINITION) * (Math.PI / 2);
			const xCorner = Math.cos(Math.PI  + alpha);
			const yCorner = Math.sin(Math.PI  + alpha);
			const x = - this.side / 2 + this.cornerRadius + this.cornerRadius * xCorner;
			const y = - this.side / 2 + this.cornerRadius + this.cornerRadius * yCorner;
			positionArray.push(glMatrix.vec4.fromValues(x, y, 0, 1));
			normalArray.push(glMatrix.vec4.fromValues(xCorner,yCorner,0,1));
		}
		positionArray.push(glMatrix.vec4.fromValues(this.side / 2 - this.cornerRadius, - this.side / 2,0,1));
		normalArray.push(glMatrix.vec4.fromValues(0,-1,0,1));

		return {positionArray, normalArray: normalArray};
	}
}