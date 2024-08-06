import { getCar } from './models/car/car'
import { getHighway } from './models/highway/highway'
import {
    getBlockGrid,
} from './models/block/block-grid'
import { getSkybox } from './models/skybox'
import { CurveEditor } from './curve-editor/curve-editor'
import { TextureMap } from './texture-map'
import { getStreetGrid } from './models/street/street-grid'
import { CameraManager } from './cameras/camera-manager'
import { initShaders } from './gl/init-shaders'
import { Matrices } from './matrices'
import { AppParameters } from './gui'
import { SceneParameters } from './scene-parameters'

const CURVE_EDITOR_SIDE = 300

const INITIAL_LIGHTS_AMOUNT = 15
const INITIAL_COLUMNS_AMOUNT = 10

function main() {    
    window.onload = initWebGL
}

function initWebGL() {
    try {
        const canvas = getCanvas()
        const gl = setUpContext(canvas)
        const sceneParameters = new SceneParameters()

        const editor = new CurveEditor('editor-container', {
            width: CURVE_EDITOR_SIDE,
            height: CURVE_EDITOR_SIDE,
        })
        const app = new AppParameters(() => sceneParameters.generate(editor), INITIAL_LIGHTS_AMOUNT, INITIAL_COLUMNS_AMOUNT) 

        const matrices = new Matrices();        
        matrices.setUpPerspectiveByDimensions(canvas.width, canvas.height)
        
        window.addEventListener('resize', () => resizeCanvas(gl, canvas, matrices))
        const cameraManager = new CameraManager()
	
        const glProgram = initShaders(gl)
        sceneParameters.generate(editor)
        const textureMap = new TextureMap(gl)
        tick(gl, glProgram, matrices, app, sceneParameters, cameraManager, textureMap)
    } catch (e) {
        throw Error(`Error: Your browser does not appear to support WebGL: ${e}`)
    }
}

function tick(gl: WebGLRenderingContext, glProgram: WebGLProgram, matrices: Matrices, app: AppParameters, params: SceneParameters, cameraManager: CameraManager, textureMap: TextureMap) {
    requestAnimationFrame(() => tick(gl, glProgram, matrices, app, params, cameraManager, textureMap))

    createScene(gl, glProgram, matrices, app.lights, app.columns, params, textureMap)
    animate(matrices, cameraManager)
}


function createScene(gl: WebGLRenderingContext, glProgram: WebGLProgram, matrices: Matrices, amountOfLights: number, amountOfColumns: number, params: SceneParameters, textureMap: TextureMap) {
    const blockGrid = getBlockGrid(
        gl,
        textureMap,
        params.buildingHeightsPerBlock,
        params.buildingVariationsPerBlock,
        params.emptyGrids
    )
    blockGrid.draw(
        gl,
        glProgram,
        matrices.modelMatrix,
        matrices.viewMatrix,
        matrices.projMatrix,
        params.lightParameters
    )

    const skybox = getSkybox(gl, textureMap)
    skybox.draw(
        gl,
        glProgram,
        matrices.modelMatrix,
        matrices.viewMatrix,
        matrices.projMatrix,
        params.lightParameters
    )

    const animationInfo = params.carAnimations.getCarsAnimationInfo()
    const cars = []
    for (let i = 0; i < 6; i++) {
        cars.push(getCar(gl, textureMap, params.carVariations[i]))
        cars[i].scalingVector = [2, 2, 2]
        cars[i].translationVector = animationInfo[i].newPosition
        cars[i].rotationAxis = [0, 1, 0]
        cars[i].rotationDegree = animationInfo[i].angle
    }

    const highway = getHighway(
        gl,
        textureMap,
        params.highwayLevels,
        Math.floor(amountOfLights),
        Math.floor(amountOfColumns)
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
        params.lightParameters
    )

    const streetGrid = getStreetGrid(gl, textureMap)
    streetGrid.draw(
        gl,
        glProgram,
        matrices.modelMatrix,
        matrices.viewMatrix,
        matrices.projMatrix,
        params.lightParameters
    )
}

function animate(matrices: Matrices, cameraManager: CameraManager) {
    matrices.viewMatrix = cameraManager.animate()
}

function resizeCanvas(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, matrices: Matrices) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
    matrices.setUpPerspectiveByDimensions(canvas.width, canvas.height)
}

function setUpContext(canvas: HTMLCanvasElement) {
    const gl: WebGLRenderingContext = canvas.getContext('webgl')!
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.1, 0.1, 0.2, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.viewport(0, 0, canvas.width, canvas.height)
    return gl
}

function getCanvas() {
    let canvas: HTMLCanvasElement = document.getElementById('my-canvas') as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    return canvas
}

main()
