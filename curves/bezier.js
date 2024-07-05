export class Bezier2 {
  deltaU = 20;
  points = [];

  setControlPoints(points) {
    if (!Array.isArray(points)) throw "points no es un array";
    points.forEach((v) => this.points.push([v[0], v[1]]));
  }

  getPolygon() {
    let sampledPoints = [];

    for (let segment = 0; segment < this.points.length - 2; segment++) {
      for (let k = 0; k < this.deltaU; k++) {
        sampledPoints.push(this.getPoint(segment, k / this.deltaU));
      }
    }
    return sampledPoints;
  }

  getPoint(segmentIndex, u) {
    let b0 = this.b0(u);
    let b1 = this.b1(u);
    let b2 = this.b2(u);

    let p0 = segmentIndex;
    let p1 = segmentIndex + 1;
    let p2 = segmentIndex + 2;
    return [
      b0 * this.points[p0][0] +
        b1 * this.points[p1][0] +
        b2 * this.points[p2][0],
      b0 * this.points[p0][1] +
        b1 * this.points[p1][1] +
        b2 * this.points[p2][1],
    ];
  }

  b0(u) {
    return 0.5 * (1 - u) * (1 - u);
  }

  b1(u) {
    return 0.5 + u * (1 - u);
  }

  b2(u) {
    return 0.5 * u * u;
  }
}
