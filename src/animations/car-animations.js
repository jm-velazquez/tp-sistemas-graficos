import { reverseLevelMatrices } from '../curves/level-matrix-generator'
import { CarAnimation } from './car-animation.js'

const LANE_OFFSETS = [21, 12, 4, 4, 12, 21]
const LANE_VELOCITIES = [0.5, 0.6, 0.7, 0.7, 0.6, 0.5]

export class CarAnimations {
    carAnimations = []

    constructor(levelMatrices) {
        const reversedLevelMatrices =
            reverseLevelMatrices(levelMatrices).reverse()

        this.carAnimations.push(
            new CarAnimation(levelMatrices, LANE_VELOCITIES[0], LANE_OFFSETS[0])
        )

        this.carAnimations.push(
            new CarAnimation(levelMatrices, LANE_VELOCITIES[1], LANE_OFFSETS[1])
        )

        this.carAnimations.push(
            new CarAnimation(levelMatrices, LANE_VELOCITIES[2], LANE_OFFSETS[2])
        )

        this.carAnimations.push(
            new CarAnimation(
                reversedLevelMatrices,
                LANE_VELOCITIES[3],
                LANE_OFFSETS[3]
            )
        )

        this.carAnimations.push(
            new CarAnimation(
                reversedLevelMatrices,
                LANE_VELOCITIES[4],
                LANE_OFFSETS[4]
            )
        )

        this.carAnimations.push(
            new CarAnimation(
                reversedLevelMatrices,
                LANE_VELOCITIES[5],
                LANE_OFFSETS[5]
            )
        )
    }

    getCarsAnimationInfo() {
        const animationInfoPerCar = this.carAnimations.map((carAnimation) =>
            carAnimation.getNewPositionAndRotationAngle()
        )
        for (let i = 0; i < 3; i++) {
            animationInfoPerCar[i].angle = -animationInfoPerCar[i].angle
        }
        return animationInfoPerCar
    }
}
