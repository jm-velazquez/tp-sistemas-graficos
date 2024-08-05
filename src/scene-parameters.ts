import { CarAnimations } from "./animations/car-animations"
import { CurveEditor } from "./curve-editor/curve-editor"
import { Bezier2 } from "./curves/bezier"
import { generateLevelMatrices } from "./curves/level-matrix-generator"
import { getBuildingBlockHeightsPerBlock, getBuildingVariationsPerBlock, getEmptyGrids } from "./models/block/block-grid"
import { BuildingVariation } from "./models/block/building"
import { availableTexture } from "./texture-map"

const CURVE_EDITOR_SIDE = 300

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

    generate(editor: CurveEditor) {
        this.buildingHeightsPerBlock = getBuildingBlockHeightsPerBlock()
        this.buildingVariationsPerBlock = getBuildingVariationsPerBlock()
        let controlPoints = editor.getControlPoints()
        controlPoints.unshift(controlPoints[0])
        controlPoints.push(controlPoints[controlPoints.length - 1])
        controlPoints = controlPoints.map((point) => [
            (point[0] - CURVE_EDITOR_SIDE / 2) * (560 / 300),
            (point[1] - CURVE_EDITOR_SIDE / 2) * (560 / 300),
        ])
        const bezierCurve = new Bezier2()
        bezierCurve.setControlPoints(controlPoints)
        this.highwayLevels = bezierCurve.getPolygon()
        this.emptyGrids = getEmptyGrids(this.highwayLevels)

        this.lightParameters.pointLight.position1 = [
            this.highwayLevels[0][0],
            -this.highwayLevels[0][1],
            50,
        ]
        this.lightParameters.pointLight.position2 = [
            this.highwayLevels[this.highwayLevels.length - 1][0],
            -this.highwayLevels[this.highwayLevels.length - 1][0],
            50,
        ]

        const levelMatrices = generateLevelMatrices(this.highwayLevels)
        this.carAnimations = new CarAnimations(levelMatrices)
    }
}
