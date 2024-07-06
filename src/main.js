import { mat4 } from 'gl-matrix'
import * as dat from 'dat.gui'

import { getCar } from '/src/models/car/car.js'
import { getHighway } from '/src/models/highway/highway.js'
import {
    getBlockGrid,
    getBuildingBlockHeightsPerBlock,
    getBuildingVariationsPerBlock,
    getEmptyGrids,
} from '/src/models/block/block-grid.js'
import { getSkybox } from '/src/models/skybox.js'
import { drawGrid } from '/src/models/grid.js'
import { CurveEditor } from '/src/curve-editor/curve-editor.js'
import { Bezier2 } from '/src/curves/bezier.js'
import { CarAnimations } from '/src/animations/car-animations.js'
import { TextureMap } from '/src/texture-map.js'
import { getStreetGrid } from '/src/models/street/street-grid.js'
import { generateLevelMatrices } from '/src/curves/level-matrix-generator.js'
import { CameraManager } from '/src/cameras/camera-manager.js'
import { initShaders } from '/src/gl/init-shaders.js'

const CURVE_EDITOR_SIDE = 300

const editor = new CurveEditor('editor-container', {
    width: CURVE_EDITOR_SIDE,
    height: CURVE_EDITOR_SIDE,
})
editor.setControlPoints([
    [0, 0],
    [300, 50],
    [50, 300],
    [300, 300],
])

let gl = null

let glProgram = null

let modelMatrix = mat4.create()
let viewMatrix = mat4.create()
let projMatrix = mat4.create()

let canvas = document.getElementById('my-canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function initWebGL() {
    try {
        gl = canvas.getContext('webgl')
    } catch (e) {
        alert('Error: Your browser does not appear to support WebGL:', e)
    }

    if (gl) {
        setupWebGL()
        glProgram = initShaders(gl)
        generateSceneParameters()
        loadTextures()
        tick(0)
    } else {
        alert('Error: Your browser does not appear to support WebGL.')
    }
}

function setupWebGL() {
    gl.enable(gl.DEPTH_TEST)
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.viewport(0, 0, canvas.width, canvas.height)

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, null)

    mat4.identity(modelMatrix)
}

function tick() {
    requestAnimationFrame(tick)

    createScene()
    animate()
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

let buildingHeightsPerBlock = []
let buildingVariationsPerBlock = []
let highwayLevels = []
let emptyGrids = []
let amountOfLights = app.lights
let amountOfColumns = app.columns
let carAnimations = null
const carVariations = ['red', 'grey', 'green', 'orange', 'blue', 'purple']

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
        position1: null,
        position2: null,
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

let textureMap = null

function loadTextures() {
    textureMap = new TextureMap(gl)
}

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
    mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, null)
}

window.addEventListener('resize', () => {
    if (gl) {
        resizeCanvas()
    }
})

function createScene() {
    drawGrid(gl, glProgram, modelMatrix, viewMatrix, projMatrix)

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
        modelMatrix,
        viewMatrix,
        projMatrix,
        lightParameters
    )

    const skybox = getSkybox(gl, textureMap)
    skybox.draw(
        gl,
        glProgram,
        modelMatrix,
        viewMatrix,
        projMatrix,
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
        modelMatrix,
        viewMatrix,
        projMatrix,
        lightParameters
    )

    const streetGrid = getStreetGrid(gl, textureMap)
    streetGrid.draw(
        gl,
        glProgram,
        modelMatrix,
        viewMatrix,
        projMatrix,
        lightParameters
    )
}

function animate() {
    viewMatrix = cameraManager.animate()
}

GUI()
window.onload = initWebGL
