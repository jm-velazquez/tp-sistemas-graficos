function distance(a, b) {
	return Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2));
}

export class LUT {
	pointsByDistance = {};
	totalDistance = 0;
	constructor(points) {
		this.pointsByDistance[0] = points[0];
		let lastDistanceSum = 0;
		for (let i = 1; i < points.length; i++) {
			const distanceFromLastPoint = distance(points[i], points[i - 1]);
			lastDistanceSum = lastDistanceSum + distanceFromLastPoint;
			this.pointsByDistance[lastDistanceSum] = points[i];
		}
		this.totalDistance = lastDistanceSum;
	}

	getInterpolatedPoint(distance) {
		if (distance === 0) return this.pointsByDistance[0];
		let lastDistance = 0;
		for (let currentDistance in this.pointsByDistance) {
			if (distance >= lastDistance && distance <= currentDistance) {
				const lastPoint = this.pointsByDistance[lastDistance];
				const currentPoint = this.pointsByDistance[currentDistance];
				const u = (distance - lastDistance) / (currentDistance - lastDistance);
				return [
					lastPoint[0] * (1 - u) + currentPoint[0] * u,
					lastPoint[1] * (1 - u) + currentPoint[1] * u,
				];
			}
			lastDistance = currentDistance;
		}
		alert("Distance out of bounds");
	}

	getClosestPointAndIndex(distance) {
		if (distance === 0) return [this.pointsByDistance[0], 0];
		let lastDistance = 0;
		let index = -1;
		for (let currentDistance in this.pointsByDistance) {
			if (distance >= lastDistance && distance <= currentDistance) {
				return [this.pointsByDistance[lastDistance], index];	
			}
			index += 1;
			lastDistance = currentDistance;
		}
		alert("Distance out of bounds");
	}

	getTotalDistance() {
		return this.totalDistance;
	}
}