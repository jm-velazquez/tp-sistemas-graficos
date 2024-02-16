export class Rectangle {
	width;
  height;
	constructor(width, height) {
		this.width = width;
    this.height = height;
	}

	getArrays() {
		const positionArray = [];
    const normalArray = [];
    const uvArray = [];

    positionArray.push(glMatrix.vec4.fromValues(-this.width / 2, - this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(0, -1, 0, 1));
    uvArray.push(0, 0);

    positionArray.push(glMatrix.vec4.fromValues(this.width / 2, - this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(0, -1, 0, 1));
    uvArray.push(1, 0);

    positionArray.push(glMatrix.vec4.fromValues(this.width / 2, - this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(1, 0, 0, 1));
    uvArray.push(1, 0);

    positionArray.push(glMatrix.vec4.fromValues(this.width / 2, this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(1, 0, 0, 1));
    uvArray.push(1, 1);

    positionArray.push(glMatrix.vec4.fromValues(this.width / 2, this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(0, 1, 0, 1));
    uvArray.push(1, 1);

    positionArray.push(glMatrix.vec4.fromValues(- this.width / 2, this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(0, 1, 0, 1));
    uvArray.push(0, 1);

    positionArray.push(glMatrix.vec4.fromValues(- this.width / 2, this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(-1, 0, 0, 1));
    uvArray.push(0, 1);

    positionArray.push(glMatrix.vec4.fromValues(-this.width / 2, - this.height / 2, 0, 1));
    normalArray.push(glMatrix.vec4.fromValues(-1, 0, 0, 1));
    uvArray.push(0, 0);

    return {positionArray, normalArray, uvArray};
	}
}
