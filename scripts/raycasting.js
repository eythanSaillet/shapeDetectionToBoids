let wallRepulsionRange = 75
class Wall {
	constructor(a1, a2, b1, b2) {
		this.a = createVector(a1, a2)
		this.b = createVector(b1, b2)
	}

	draw() {
		line(this.a.x, this.a.y, this.b.x, this.b.y)
	}
}

// Using Line-line intersection algorythm
// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
function intersectTest(wall, pos, dir) {
	let den = (wall.a.x - wall.b.x) * (pos.y - pos.y + dir.y) - (wall.a.y - wall.b.y) * (pos.x - pos.x + dir.x)
	let t = ((wall.a.x - pos.x) * (pos.y - pos.y + dir.y) - (wall.a.y - pos.y) * (pos.x - pos.x + dir.x)) / den
	let u = ((wall.a.x - wall.b.x) * (wall.a.y - pos.y) - (wall.a.y - wall.b.y) * (wall.a.x - pos.x)) / den

	let crossPoint, dist
	if (t > 0 && t < 1 && u > 0) {
		crossPoint = createVector(wall.a.x + t * (wall.b.x - wall.a.x), wall.a.y + t * (wall.b.y - wall.a.y))
		// stroke('red')
		// strokeWeight(10)
		// point(crossPoint.x, crossPoint.y)
		dist = pos.dist(crossPoint)
		if (dist < wallRepulsionRange) {
			// console.log({ state: true, dist: dist })
			return { state: true, dist: dist }
		}
	}
	return { state: false }
}
