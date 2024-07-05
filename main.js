import { getCar } from "/models/car/car.js";
import { getHighway } from "/models/highway/highway.js";
import { getBlockGrid, getBuildingBlockHeightsPerBlock, getBuildingVariationsPerBlock, getEmptyGrids } from "/models/block/block-grid.js";
import { getSkybox } from "/models/skybox.js";
import { drawGrid } from "/models/grid.js";
import { CurveEditor } from "/curve-editor/curve-editor.js";
import { Bezier2 } from "/curves/bezier.js";
import { CarAnimations } from "/animations/car-animations.js";
import { TextureMap } from "/texture-map.js";
import { getStreetGrid } from "/models/street/street-grid.js";
import { generateLevelMatrices } from "/curves/level-matrix-generator.js";
import { CameraManager } from "/cameras/camera-manager.js";

const CURVE_EDITOR_SIDE = 300;

const editor = new CurveEditor(
    "editor-container",
    { width: CURVE_EDITOR_SIDE, height: CURVE_EDITOR_SIDE }
);
editor.setControlPoints([[0,0],[300,50],[50,300],[300,300]]);

let mat4=glMatrix.mat4;
let vec3=glMatrix.vec3;

let gl = null;

let glProgram = null;
let fragmentShader = null;
let vertexShader = null;
    
let modelMatrix = mat4.create();
let viewMatrix = mat4.create();
let projMatrix = mat4.create();
let rotate_angle = -1.57078;

let canvas = document.getElementById("my-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    resizeCanvas();
});

function initWebGL(){
    try{
        gl = canvas.getContext("webgl");      

    }catch(e){
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

    if(gl) {
        setupWebGL();
        initShaders();
        generateSceneParameters();
        loadTextures();
        tick(0);

    }else{    
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

}


function setupWebGL(){
    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);     
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(projMatrix,45, canvas.width / canvas.height, 0.1, null);
    
    mat4.identity(modelMatrix);
}
        
        
function initShaders() {
    //get shader source
    let fs_source = document.getElementById('shader-fs').innerHTML;
    let vs_source = document.getElementById('shader-vs').innerHTML;

    //compile shaders    
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);
    
    //create program
    glProgram = gl.createProgram();
    
    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
        console.log(gl.getShaderInfoLog(vertexShader));
        console.log(gl.getShaderInfoLog(fragmentShader));
    }
    
    //use program
    gl.useProgram(glProgram);
}

function makeShader(src, type){
    //compile the vertex shader
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function tick(timestamp){
    requestAnimationFrame(tick);

    createScene();
    animate();
}

let app = {
    generate: () => {
        generateSceneParameters();
    },
    showEditor: () => {

    },
    lights: 15,
    columns: 10,
};

function GUI() {
    const gui = new dat.GUI();		

    const f1 = gui.addFolder('Generate');		
    f1.add(app, 'generate').name("Generate Scenery");				
    f1.open();

    const f2 = gui.addFolder('Parameters');
    f2.add(app, 'lights', 4, 25).name("Lights");
    f2.add(app, 'columns', 4, 25).name("Columns");
    f2.open();
};

const cameraManager = new CameraManager(glMatrix);

window.addEventListener("keydown", (e) => {
    if (e.key === "h") editor.toggleVisibility();
});


let buildingHeightsPerBlock = [];
let buildingVariationsPerBlock = [];
let highwayLevels = []; 
let emptyGrids = [];
let amountOfLights = app.lights;
let amountOfColumns = app.columns;
let carAnimations = null;
const carVariations = ["red", "grey", "green", "orange", "blue", "purple"];

const lightParameters = {
    ambientLight: {
        topColor: [115, 146, 235],
        bottomColor: [216, 197, 150],
        strength: 0.5,
    },
    directionalLight: {
        color: [252,255,181],
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
    buildingHeightsPerBlock = getBuildingBlockHeightsPerBlock();
    buildingVariationsPerBlock = getBuildingVariationsPerBlock();
    let controlPoints = editor.getControlPoints();
    controlPoints.unshift(controlPoints[0]);
    controlPoints.push(controlPoints[controlPoints.length -1 ]);
    controlPoints = controlPoints.map(point => [
        (point[0] - CURVE_EDITOR_SIDE / 2) * (560 / 300),
        (point[1] - CURVE_EDITOR_SIDE / 2) * (560 / 300),
    ]);
    const bezierCurve = new Bezier2();
    bezierCurve.setControlPoints(controlPoints);
    highwayLevels = bezierCurve.getPolygon();
    emptyGrids = getEmptyGrids(highwayLevels);
    amountOfLights = Math.floor(app.lights);
    amountOfColumns = Math.floor(app.columns);

    lightParameters.pointLight.position1 = [
        highwayLevels[0][0],
        - highwayLevels[0][1],
        50,
    ];
    lightParameters.pointLight.position2 = [
        highwayLevels[highwayLevels.length - 1][0],
        - highwayLevels[highwayLevels.length - 1][0],
        50,
    ];

    const levelMatrices = generateLevelMatrices(glMatrix, highwayLevels);
    carAnimations = new CarAnimations(glMatrix, levelMatrices);
}

let textureMap = null;

function loadTextures() {
    textureMap = new TextureMap(gl);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, null);
}

function createScene() {
    drawGrid(gl, glMatrix, glProgram, modelMatrix, viewMatrix, projMatrix);

    const blockGrid = getBlockGrid(gl, glMatrix, textureMap, buildingHeightsPerBlock, buildingVariationsPerBlock, emptyGrids);
    blockGrid.draw(gl, glMatrix, glProgram, modelMatrix, viewMatrix, projMatrix, lightParameters);

    const skybox = getSkybox(gl, textureMap);
    skybox.draw(gl, glMatrix, glProgram, modelMatrix, viewMatrix, projMatrix, lightParameters);

    const animationInfo = carAnimations.getCarsAnimationInfo(glMatrix);
    const cars = [];
    for (let i = 0; i < 6; i++) {
        cars.push(getCar(gl, glMatrix, textureMap, carVariations[i]));
        cars[i].scalingVector = [2,2,2];
        cars[i].translationVector = animationInfo[i].newPosition;
        cars[i].rotationAxis = [0, 1, 0];
        cars[i].rotationDegree = animationInfo[i].angle;
    }

    const highway = getHighway(gl, glMatrix, textureMap, highwayLevels, amountOfLights, amountOfColumns);
    highway.rotationAxis = [1, 0, 0];
    highway.rotationDegree = Math.PI  / 2;
    highway.translationVector = [0, 0, 30];

    for (let i = 0; i < 6; i++) {
        highway.addChild(cars[i]);
    }

    highway.draw(gl, glMatrix, glProgram, modelMatrix, viewMatrix, projMatrix, lightParameters);

    const streetGrid = getStreetGrid(gl, textureMap);
    streetGrid.draw(gl, glMatrix, glProgram, modelMatrix, viewMatrix, projMatrix, lightParameters);

    const car = getCar(gl, glMatrix, textureMap);
    car.rotationAxis = [1, 0, 0];
    car.rotationDegree = Math.PI / 2;
    car.translationVector = [0,0,2];
    car.draw(gl, glMatrix, glProgram, modelMatrix, viewMatrix, projMatrix, lightParameters);
}

function animate() {
    viewMatrix = cameraManager.animate(glMatrix);
}

GUI();
window.onload=initWebGL;