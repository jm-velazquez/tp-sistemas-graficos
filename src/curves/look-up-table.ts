function distance(a: number[], b: number[]) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

export class LUT {
    pointsByDistance: Map<number, number[]>
    totalDistance: number

    constructor(points: number[][]) {
        this.pointsByDistance = new Map()
        this.pointsByDistance.set(0, points[0])
        let lastDistanceSum = 0
        for (let i = 1; i < points.length; i++) {
            const distanceFromLastPoint = distance(points[i], points[i - 1])
            lastDistanceSum = lastDistanceSum + distanceFromLastPoint
            this.pointsByDistance.set(lastDistanceSum, points[i])
        }
        this.totalDistance = lastDistanceSum
    }

    getInterpolatedPoint(distance: number): number[] {
        if (distance === 0) return this.pointsByDistance.get(0)!
        let lastDistance = 0
        for (const [currentDistance, currentPoint] of this.pointsByDistance) {
            if (distance >= lastDistance && distance <= currentDistance) {
                const lastPoint = this.pointsByDistance.get(lastDistance)!
                const u =
                    (distance - lastDistance) / (currentDistance - lastDistance)
                const newPoint = [
                    lastPoint[0] * (1 - u) + currentPoint[0] * u,
                    lastPoint[1] * (1 - u) + currentPoint[1] * u,
                ]
                return newPoint
            }
            lastDistance = currentDistance
        }
        throw 'LUT: distance out of bounds'
    }

    getClosestPointAndIndex(distance: number): [number[], number] {
        if (distance === 0) return [this.pointsByDistance.get(0)!, 0]
        let lastDistance = 0
        let index = -1
        for (let [currentDistance, currentPoint] of this.pointsByDistance) {
            if (distance >= lastDistance && distance <= currentDistance) {
                return [currentPoint, index]
            }
            index += 1
            lastDistance = currentDistance
        }
        throw 'Distance out of bounds'
    }

    getTotalDistance() {
        return this.totalDistance
    }
}
