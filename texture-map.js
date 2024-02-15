function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
}

function loadTexture(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		1,
		1,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		new Uint8Array([0, 255, 0, 255]),
	);

	const image = new Image();
	image.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			image,
		);
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	}
	image.src = url;
	return texture;
}

export class TextureMap {
	map = {}

	constructor(gl) {
		this.map.buildings = loadTexture(gl, "./resources/buildings.jpg");
		this.map.sidewalk = loadTexture(gl, "./resources/sidewalk.jpg");
	}

	getTexture(textureName) {
		return this.map[textureName];
	}
}
