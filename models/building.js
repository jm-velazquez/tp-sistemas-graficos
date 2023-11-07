export function getBuildingBuffers(gl, width, length, height,
	xOffset = 0, yOffset = 0, zOffset = 0, indexBufferOffset = 0) {
	const positionBuffer = [];
	const normalBuffer = [];
	let indexBuffer = [];
	positionBuffer.push(
		xOffset,yOffset,zOffset,														// 0
		xOffset,yOffset,zOffset,														// 1
		xOffset,yOffset,zOffset,														// 2
		xOffset + width,yOffset,zOffset,										// 3
		xOffset + width,yOffset,zOffset,										// 4
		xOffset + width,yOffset,zOffset,										// 5
		xOffset,yOffset + length,zOffset,										// 6
		xOffset,yOffset + length,zOffset,										// 7
		xOffset,yOffset + length,zOffset,										// 8
		xOffset + width,yOffset + length,zOffset,						// 9
		xOffset + width,yOffset + length,zOffset,						// 10
		xOffset + width,yOffset + length,zOffset,						// 11
		xOffset,yOffset,zOffset + height,										// 12
		xOffset,yOffset,zOffset + height,										// 13
		xOffset,yOffset,zOffset + height,										// 14
		xOffset + width,yOffset,zOffset + height,						// 15
		xOffset + width,yOffset,zOffset + height,						// 16
		xOffset + width,yOffset,zOffset + height,						// 17
		xOffset,yOffset + length,zOffset + height,					// 18
		xOffset,yOffset + length,zOffset + height,					// 19
		xOffset,yOffset + length,zOffset + height,					// 20
		xOffset + width,yOffset + length,zOffset + height,	// 21
		xOffset + width,yOffset + length,zOffset + height,	// 22
		xOffset + width,yOffset + length,zOffset + height,	// 23
	);

	normalBuffer.push(
		0, 0,-1,		// 0
		0,-1, 0,		// 1
		-1,0, 0,		// 2
		0, 0,-1,		// 3
		0,-1, 0,		// 4
		1, 0, 0,		// 5
		0, 0,-1,		// 6
		0, 1, 0,		// 7
		-1,0, 0,		// 8
		0, 0,-1,		// 9
		0, 1, 0,		// 10
		1, 0, 0,		// 11
		0, 0, 1,		// 12
		0,-1, 0,		// 13
		-1,0, 0,		// 14
		0, 0, 1,		// 15
		0,-1, 0,		// 16
		1, 0, 0,		// 17
		0, 0, 1,		// 18
		0, 1, 0,		// 19
		-1,0, 0,		// 20
		0, 0, 1,		// 21
		0, 1, 0,		// 22
		1, 0, 0,		// 23
	);

	indexBuffer.push(
		0,3,6,
		3,6,9,
		1,4,16,
		1,13,16,
		2,14,8,
		14,8,20,
		7,10,22,
		7,19,22,
		5,17,23,
		5,23,11,
		12,15,18,
		15,18,21,
	);
	indexBuffer = indexBuffer.map(x => x + indexBufferOffset);
	return {positionBuffer, normalBuffer, indexBuffer};
}
