import { CarAnimations } from "./animations/car-animations"
import { BuildingVariation } from "./models/block/building"
import { availableTexture } from "./texture-map"

interface AmbientLight {
    topColor: number[]
    bottomColor: number[]
    strength: number
}

interface DirectionalLight {
    color: number[]
    direction: number[]
    strength: number
}

interface PointLight {
    position1: number[]
    position2: number[]
    color: number[]
    strength: number
}

interface LightParameters {
    ambientLight: AmbientLight
    directionalLight: DirectionalLight
    pointLight: PointLight
}

export class SceneParameters {
    buildingHeightsPerBlock: number[][]
    buildingVariationsPerBlock: BuildingVariation[][]
    highwayLevels: number[][]
    emptyGrids: boolean[]
    carAnimations: CarAnimations
    carVariations: availableTexture[]
    lightParameters: LightParameters

    constructor() {
        this.buildingHeightsPerBlock = []
        this.buildingVariationsPerBlock = []
        this.highwayLevels = []
        this.emptyGrids = []
        this.carAnimations = new CarAnimations(this.highwayLevels)
        this.carVariations = [
            'red',
            'grey',
            'green',
            'orange',
            'blue',
            'purple',
        ]
        this.lightParameters = {
            ambientLight: {
                topColor: [115, 146, 235],
                bottomColor: [216, 197, 150],
                strength: 0.5
            },
            directionalLight: {
                color: [252, 255, 181],
                direction: [1, 2, 3],
                strength: 1.5
            },
            pointLight: {
                position1: [0, 0, 0],
                position2: [0, 0, 0],
                color: [255, 230, 146],
                strength: 1,
            }
        }
    }
}