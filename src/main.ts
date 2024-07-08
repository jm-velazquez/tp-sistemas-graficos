import { mat4 } from 'gl-matrix'
import * as dat from 'dat.gui'

import { getCar } from './models/car/car'
import { getHighway } from './models/highway/highway'
import {
    getBlockGrid,
    getBuildingBlockHeightsPerBlock,
    getBuildingVariationsPerBlock,
    getEmptyGrids,
} from './models/block/block-grid'
import { getSkybox } from './models/skybox'
import { CurveEditor } from './curve-editor/curve-editor'
import { Bezier2 } from './curves/bezier'
import { CarAnimations } from './animations/car-animations.js'
import { availableTexture, TextureMap } from './texture-map'
import { getStreetGrid } from './models/street/street-grid'
import { generateLevelMatrices } from './curves/level-matrix-generator'
import { CameraManager } from './cameras/camera-manager'
import { initShaders } from './gl/init-shaders'
import { BuildingVariation } from './models/block/building'

const CURVE_EDITOR_SIDE = 300

class Matrices {
    public modelMatrix: mat4
    public viewMatrix: mat4
    public projMatrix: mat4

    constructor() {
        this.modelMatrix = mat4.create()
        this.viewMatrix = mat4.create()
        this.projMatrix = mat4.create()
    }
}

function main() {
    const editor = new CurveEditor('editor-container', {
        width: CURVE_EDITOR_SIDE,
        height: CURVE_EDITOR_SIDE,
    })

    function initWebGL() {
        try {
            let canvas: HTMLCanvasElement = document.getElementById('my-canvas') as HTMLCanvasElement
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            let gl: WebGLRenderingContext = canvas.getContext('webgl')!
            const matrices = setupWebGL(gl, canvas)
            const resizeCanvas = (gl: WebGLRenderingContext, matrices: Matrices) => {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
                gl.viewport(0, 0, canvas.width, canvas.height)
                mat4.perspective(
                    matrices.projMatrix,
                    45,
                    canvas.width / canvas.height,
                    0.1,
                    Infinity
                )
            }
            window.addEventListener('resize', () => resizeCanvas(gl, matrices))
            
            let glProgram = initShaders(gl)
            generateSceneParameters()
            loadTextures(gl)
            tick(gl, glProgram, matrices)
        } catch (e) {
            throw Error(`Error: Your browser does not appear to support WebGL: ${e}`)
        }
    }
    
    function setupWebGL(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
        gl.enable(gl.DEPTH_TEST)
        //set the clear color
        gl.clearColor(0.1, 0.1, 0.2, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
        gl.viewport(0, 0, canvas.width, canvas.height)
    
        let matrices = new Matrices();

        // Matrix de Proyeccion Perspectiva
    
        mat4.perspective(
            matrices.projMatrix,
            45,
            canvas.width / canvas.height,
            0.1,
            Infinity
        )
    
        mat4.identity(matrices.modelMatrix)

        return matrices
    }
    
    function tick(gl: WebGLRenderingContext, glProgram: WebGLProgram, matrices: Matrices) {
        requestAnimationFrame(() => tick(gl, glProgram, matrices))
    
        createScene(gl, glProgram, matrices)
        animate(matrices)
    }
    
    let app = {
        generate: () => {
            generateSceneParameters()
        },
        showEditor: () => {},
        lights: 15,
        columns: 10,
    }
    
    function GUI() {
        const gui = new dat.GUI()
    
        const f1 = gui.addFolder('Generate')
        f1.add(app, 'generate').name('Generate Scenery')
        f1.open()
    
        const f2 = gui.addFolder('Parameters')
        f2.add(app, 'lights', 4, 25).name('Lights')
        f2.add(app, 'columns', 4, 25).name('Columns')
        f2.open()
    }
    
    const cameraManager = new CameraManager()
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'h') editor.toggleVisibility()
    })
    
    let buildingHeightsPerBlock: number[][] = []
    let buildingVariationsPerBlock: BuildingVariation[][] = []
    let highwayLevels: number[][] = []
    let emptyGrids: boolean[] = []
    let amountOfLights = app.lights
    let amountOfColumns = app.columns
    let carAnimations: CarAnimations
    const carVariations: availableTexture[] = [
        'red',
        'grey',
        'green',
        'orange',
        'blue',
        'purple',
    ]
    
    const lightParameters = {
        ambientLight: {
            topColor: [115, 146, 235],
            bottomColor: [216, 197, 150],
            strength: 0.5,
        },
        directionalLight: {
            color: [252, 255, 181],
            direction: [1, 2, 3],
            strength: 1.5,
        },
        pointLight: {
            position1: [0, 0, 0],
            position2: [0, 0, 0],
            color: [255, 230, 146],
            strength: 1,
        },
    }
    
    function generateSceneParameters() {
        buildingHeightsPerBlock = getBuildingBlockHeightsPerBlock()
        buildingVariationsPerBlock = getBuildingVariationsPerBlock()
        let controlPoints = editor.getControlPoints()
        controlPoints.unshift(controlPoints[0])
        controlPoints.push(controlPoints[controlPoints.length - 1])
        controlPoints = controlPoints.map((point) => [
            (point[0] - CURVE_EDITOR_SIDE / 2) * (560 / 300),
            (point[1] - CURVE_EDITOR_SIDE / 2) * (560 / 300),
        ])
        const bezierCurve = new Bezier2()
        bezierCurve.setControlPoints(controlPoints)
        highwayLevels = bezierCurve.getPolygon()
        emptyGrids = getEmptyGrids(highwayLevels)
        amountOfLights = Math.floor(app.lights)
        amountOfColumns = Math.floor(app.columns)
    
        lightParameters.pointLight.position1 = [
            highwayLevels[0][0],
            -highwayLevels[0][1],
            50,
        ]
        lightParameters.pointLight.position2 = [
            highwayLevels[highwayLevels.length - 1][0],
            -highwayLevels[highwayLevels.length - 1][0],
            50,
        ]
    
        const levelMatrices = generateLevelMatrices(highwayLevels)
        carAnimations = new CarAnimations(levelMatrices)
    }
    
    let textureMap: TextureMap
    
    function loadTextures(gl: WebGLRenderingContext) {
        textureMap = new TextureMap(gl)
    }
    
    function createScene(gl: WebGLRenderingContext, glProgram: WebGLProgram, matrices: Matrices) {
        const blockGrid = getBlockGrid(
            gl,
            textureMap,
            buildingHeightsPerBlock,
            buildingVariationsPerBlock,
            emptyGrids
        )
        blockGrid.draw(
            gl,
            glProgram,
            matrices.modelMatrix,
            matrices.viewMatrix,
            matrices.projMatrix,
            lightParameters
        )
    
        const skybox = getSkybox(gl, textureMap)
        skybox.draw(
            gl,
            glProgram,
            matrices.modelMatrix,
            matrices.viewMatrix,
            matrices.projMatrix,
            lightParameters
        )
    
        const animationInfo = carAnimations.getCarsAnimationInfo()
        const cars = []
        for (let i = 0; i < 6; i++) {
            cars.push(getCar(gl, textureMap, carVariations[i]))
            cars[i].scalingVector = [2, 2, 2]
            cars[i].translationVector = animationInfo[i].newPosition
            cars[i].rotationAxis = [0, 1, 0]
            cars[i].rotationDegree = animationInfo[i].angle
        }
    
        const highway = getHighway(
            gl,
            textureMap,
            highwayLevels,
            amountOfLights,
            amountOfColumns
        )
        highway.rotationAxis = [1, 0, 0]
        highway.rotationDegree = Math.PI / 2
        highway.translationVector = [0, 0, 30]
    
        for (let i = 0; i < 6; i++) {
            highway.addChild(cars[i])
        }
    
        highway.draw(
            gl,
            glProgram,
            matrices.modelMatrix,
            matrices.viewMatrix,
            matrices.projMatrix,
            lightParameters
        )
    
        const streetGrid = getStreetGrid(gl, textureMap)
        streetGrid.draw(
            gl,
            glProgram,
            matrices.modelMatrix,
            matrices.viewMatrix,
            matrices.projMatrix,
            lightParameters
        )
    }
    
    function animate(matrices: Matrices) {
        matrices.viewMatrix = cameraManager.animate()
    }
    
    GUI()
    window.onload = initWebGL
}


main()