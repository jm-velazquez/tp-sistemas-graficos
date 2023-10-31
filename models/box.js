function getBox() {
	const boxBuffers = getBoxBuffers();
	return new Model(boxBuffers.glPositionBuffer, boxBuffers.glNormalBuffer, boxBuffers.glIndexBuffer);
}
