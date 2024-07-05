export class QuarterCircle {
  radius;
  definition;

  constructor(radius = 1, definition = 8) {
    this.radius = radius;
    this.definition = definition;
  }

  getPosition(u) {
    const alpha = (u * Math.PI) / 2;
    const x = this.radius * Math.cos(alpha);
    const y = this.radius * Math.sin(alpha);
    return glMatrix.vec4.fromValues(x, y, 0, 1);
  }

  getArrays() {
    const increment = 1 / this.definition;
    const positionArray = [];
    const normalArray = [];
    const uvArray = [];

    for (let i = 0; i <= this.definition; i++) {
      const position = this.getPosition(i * increment);
      const normal = glMatrix.vec4.create();
      glMatrix.vec4.normalize(normal, position);
      positionArray.push(position);
      normalArray.push(normal);
      uvArray.push(
        position[0] / this.radius + this.radius,
        position[1] / this.radius + this.radius,
      );
    }
    return { positionArray, normalArray, uvArray };
  }
}
