// Receives an array of 2D coordinates (X and Z)
export function generateLevelMatrices(glMatrix, levels) {
	const levelMatrices = [];
	for (let i = 0; i < levels.length - 1; i++) {
		levelMatrices.push(generateLevelMatrix(glMatrix, levels[i], levels[i + 1]));
	}
	levelMatrices.push(generateLastLevelMatrix(
		glMatrix,
		levels[levels.length - 2],
		levels[levels.length - 1]
	));
	return levelMatrices;
}

function generateLevelMatrix(glMatrix, currentLevel, nextLevel) {
	const tangent = getTangent(glMatrix, currentLevel, nextLevel);
	const binormal = glMatrix.vec3.fromValues(0,1,0);
	const normal = getNormal(glMatrix, tangent);
	return buildLevelMatrix(glMatrix, tangent, normal, binormal, currentLevel);
}

function generateLastLevelMatrix(glMatrix, previousLevel, currentLevel) {
	const tangent = getTangent(glMatrix, previousLevel, currentLevel);
	const binormal = glMatrix.vec3.fromValues(0,1,0);
	const normal = getNormal(glMatrix, tangent);
	return buildLevelMatrix(glMatrix, tangent, normal, binormal, currentLevel);
}

function getTangent(glMatrix, currentLevel, nextLevel) {
	const tangent = glMatrix.vec3.fromValues(
		nextLevel[0] - currentLevel[0],
		0,
		nextLevel[1] - currentLevel[1],
	);
	glMatrix.vec3.normalize(tangent, tangent);
	return tangent;
}

function getNormal(glMatrix, tangent) {
	const normal = glMatrix.vec3.create();
	glMatrix.vec3.rotateY(normal, tangent, [0,0,0], Math.PI / 2);
	return normal;
}

function buildLevelMatrix(glMatrix, tangent, normal, binormal, position) {
	return glMatrix.mat4.fromValues(
		normal[0], normal[1], normal[2], 0,
		binormal[0], binormal[1], binormal[2], 0,
		tangent[0], tangent[1], tangent[2], 0,
		position[0], 0, position[1], 1,
	);
}