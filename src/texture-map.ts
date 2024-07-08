function isPowerOf2(value: number) {
    return (value & (value - 1)) === 0
}

function loadTexture(gl: WebGLRenderingContext, url: string): WebGLTexture {
    const texture = gl.createTexture()
    if (!texture) {
        throw Error('Failed to create texture')
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 255, 0, 255])
    )

    const image = new Image()
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        )
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        }
    }
    image.src = url
    return texture
}

function loadMonocromaticTexture(
    gl: WebGLRenderingContext,
    r: number,
    g: number,
    b: number
) {
    const texture = gl.createTexture()
    if (!texture) {
        throw Error('Failed to create texture')
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([r, g, b, 255])
    )

    return texture
}

type availableColor =
    | 'grey'
    | 'lightGrey'
    | 'red'
    | 'green'
    | 'orange'
    | 'blue'
    | 'purple'
    | 'black'
export type availableTexture =
    | 'buildings'
    | 'sidewalk'
    | 'sidewalkNormal'
    | 'highwayRoad'
    | 'grass'
    | 'concrete'
    | 'concreteWall'
    | 'skybox'
    | 'street'
    | availableColor

export class TextureMap {
    private map: Map<availableTexture, WebGLTexture>

    constructor(gl: WebGLRenderingContext) {
        this.map = new Map()
        this.map.set('buildings', loadTexture(gl, '/tp-sistemas-graficos/resources/buildings.jpg'))
        this.map.set('sidewalk', loadTexture(gl, '/tp-sistemas-graficos/resources/sidewalk2.jpg'))
        this.map.set(
            'sidewalkNormal',
            loadTexture(gl, '/tp-sistemas-graficos/resources/sidewalk2_normal.jpg')
        )
        this.map.set(
            'highwayRoad',
            loadTexture(gl, '/tp-sistemas-graficos/resources/highway_road_wide.jpg')
        )
        this.map.set('grass', loadTexture(gl, '/tp-sistemas-graficos/resources/grass2.jpg'))
        this.map.set('concrete', loadTexture(gl, '/tp-sistemas-graficos/resources/concrete.jpg'))
        this.map.set(
            'concreteWall',
            loadTexture(gl, '/tp-sistemas-graficos/resources/concrete_wall.jpg')
        )
        this.map.set('skybox', loadTexture(gl, '/tp-sistemas-graficos/resources/skybox.png'))
        this.map.set('street', loadTexture(gl, '/tp-sistemas-graficos/resources/street.jpg'))
        this.map.set('grey', loadMonocromaticTexture(gl, 33, 33, 33))
        this.map.set('lightGrey', loadMonocromaticTexture(gl, 189, 189, 189))
        this.map.set('red', loadMonocromaticTexture(gl, 183, 28, 28))
        this.map.set('green', loadMonocromaticTexture(gl, 85, 139, 47))
        this.map.set('orange', loadMonocromaticTexture(gl, 230, 81, 0))
        this.map.set('blue', loadMonocromaticTexture(gl, 2, 119, 189))
        this.map.set('purple', loadMonocromaticTexture(gl, 69, 39, 160))
        this.map.set('black', loadMonocromaticTexture(gl, 0, 0, 0))
    }

    getTexture(textureName: availableTexture): WebGLTexture {
        return this.map.get(textureName)!
    }
}
