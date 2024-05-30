function pointDistance(v1, v2) {
	let dx = v2.x - v1.x;
	let dy = v2.z - v1.z;

	return Math.sqrt(dx * dx + dz * dz);
}

function pointDirection(point1, point2) {
	let dx = point2.x - point1.x;
	let dz = point2.z - point1.z;
	
	let angleRadians = Math.atan2(dz, dx);
	
	let angleDegrees = angleRadians * (180.0 / Math.PI);
	angleDegrees -= 90.0;
	if (angleDegrees < 0) {
		angleDegrees += 360.0;
	}

	return angleDegrees;
}

function moveInDirection(pos, speed, direction) {
	let angleRadians = (direction + 90) * (Math.PI / 180.0);
	pos.x -= speed * Math.cos(angleRadians);
	pos.z -= speed * Math.sin(angleRadians);
}

function createTimer(delay) {
	let lastTime = 0;
	return function() {
		const currentTime = performance.now();
		if (currentTime - lastTime >= delay) {
			lastTime = currentTime;
			return true;
		}
		return false;
	};
}

function isInRectangle(pos, rectCenter, rectWidth, rectHeight) {
	const halfWidth = rectWidth / 2;
	const halfHeight = rectHeight / 2;

	const left = rectCenter.x - halfWidth;
	const right = rectCenter.x + halfWidth;
	const top = rectCenter.z - halfHeight;
	const bottom = rectCenter.z + halfHeight;

	return (
		pos.x >= left &&
		pos.x <= right &&
		pos.z >= top &&
		pos.z <= bottom
	);
}



export { pointDistance, pointDirection, moveInDirection, createTimer, isInRectangle };