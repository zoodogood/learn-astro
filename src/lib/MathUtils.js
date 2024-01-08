export function getDistance(dotsA, dotsB) {
	const straight = [];
	for (let index = 0; index < dotsA.length; index++) {
		straight.push(dotsA[index] - dotsB[index]);
	}
	
	return Math.sqrt(
		straight.reduce((acc, segment) => acc + segment ** 2, 0)
	);
}

export function getDistance2d(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
