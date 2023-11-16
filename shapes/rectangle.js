export class Rectangle {
	width;
  height;
	constructor(width, height) {
		this.width = width;
    this.height = height;
	}

	getPositionAndNormalArrays(glMatrix) {
		const positionArray = [];
    const normalArray = [];

    positionArray.push(glMatrix.vec4.fromValues(-this.width / 2, - this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(0, -1, 0, 1));
    positionArray.push(glMatrix.vec4.fromValues(this.width / 2, - this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(0, -1, 0, 1));
    positionArray.push(glMatrix.vec4.fromValues(this.width / 2, - this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(1, 0, 0, 1));
    positionArray.push(glMatrix.vec4.fromValues(this.width / 2, this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(1, 0, 0, 1));
    positionArray.push(glMatrix.vec4.fromValues(this.width / 2, this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(0, 1, 0, 1));
    positionArray.push(glMatrix.vec4.fromValues(- this.width / 2, this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(0, 1, 0, 1));
    positionArray.push(glMatrix.vec4.fromValues(- this.width / 2, this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(-1, 0, 0, 1));
    positionArray.push(glMatrix.vec4.fromValues(-this.width / 2, - this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(-1, 0, 0, 1));

    return {positionArray, normalArray};
	}
}