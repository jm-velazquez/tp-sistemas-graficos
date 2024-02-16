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
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	}
	image.src = url;
	return texture;
}

function loadMonocromaticTexture(gl, r, g, b) {
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
		new Uint8Array([r, g, b, 255]),
	);

	return texture;
}

export class TextureMap {
	map = {}

	constructor(gl) {
		this.map.buildings = loadTexture(gl, "./resources/buildings.jpg");
		this.map.sidewalk = loadTexture(gl, "./resources/sidewalk.jpg");
		this.map.highwayRoad = loadTexture(gl, "./resources/highway_road.jpg");
		this.map.grass = loadTexture(gl, "./resources/grass.jpg");
		this.map.grey = loadMonocromaticTexture(gl, 33, 33, 33);
		this.map.lightGrey = loadMonocromaticTexture(gl, 189, 189, 189);
		this.map.lightGreen = loadMonocromaticTexture(gl, 0, 255, 0);
		this.map.teal = loadMonocromaticTexture(gl, 0, 52, 43);
	}

	getTexture(textureName) {
		return this.map[textureName];
	}
}
