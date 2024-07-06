import { vec3 } from 'gl-matrix'
import {
    translateMatricesAlongNormalAxis,
    getPositionsFromLevelMatrices,
} from '../curves/level-matrix-generator'
import { LUT } from '../curves/look-up-table.ts'

export class CarAnimation {
    levelMatrices
    lookUpTable
    velocity
    currentDistanceTravelled = 0

    constructor(levelMatrices, velocity, normalOffset = 0) {
        this.levelMatrices = translateMatricesAlongNormalAxis(
            levelMatrices,
            normalOffset
        )
        const pathVertices = getPositionsFromLevelMatrices(
            this.levelMatrices
        ).map((vertice) => [vertice[0], vertice[2]])
        this.lookUpTable = new LUT(pathVertices)
        this.velocity = velocity
    }

    getNewPositionAndRotationAngle() {
        let newDistanceTravelled = this.currentDistanceTravelled + this.velocity
        if (newDistanceTravelled > this.lookUpTable.getTotalDistance())
            newDistanceTravelled -= this.lookUpTable.getTotalDistance()
        this.currentDistanceTravelled = newDistanceTravelled
        const newPositionOnXZPlane =
            this.lookUpTable.getInterpolatedPoint(newDistanceTravelled)
        const newPosition = [
            newPositionOnXZPlane[0],
            3,
            newPositionOnXZPlane[1],
        ]

        const closestPointIndex =
            this.lookUpTable.getClosestPointAndIndex(newDistanceTravelled)[1]
        const closestLevelMatrix = this.levelMatrices[closestPointIndex]
        const tangent = closestLevelMatrix.slice(8, 12)
        const angle = vec3.angle(tangent, [1, 0, 0])

        return { newPosition, angle }
    }
}
