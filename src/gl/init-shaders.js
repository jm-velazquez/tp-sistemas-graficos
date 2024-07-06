export function initShaders(gl) {
    //get shader source
    let fs_source = document.getElementById('shader-fs').innerHTML
    let vs_source = document.getElementById('shader-vs').innerHTML

    //compile shaders
    let vertexShader = makeShader(gl, vs_source, gl.VERTEX_SHADER)
    let fragmentShader = makeShader(gl, fs_source, gl.FRAGMENT_SHADER)

    //create program
    let glProgram = gl.createProgram()

    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader)
    gl.attachShader(glProgram, fragmentShader)
    gl.linkProgram(glProgram)

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program.')
        console.log(gl.getShaderInfoLog(vertexShader))
        console.log(gl.getShaderInfoLog(fragmentShader))
    }

    //use program
    gl.useProgram(glProgram)

    return glProgram
}

function makeShader(gl, src, type) {
    //compile the vertex shader
    let shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('Error compiling shader: ' + gl.getShaderInfoLog(shader))
    }
    return shader
}
