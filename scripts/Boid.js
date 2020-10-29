class Boid {
	constructor() {
		this.pos = createVector(random(30, width - 30), random(30, height - 30))
		this.vel = p5.Vector.random2D()
		this.acc = p5.Vector.random2D()
		this.angle = null
		this.maxSpeed = 2
		this.maxForce = 0.15
		this.triangleRadius = 7
	}

	align() {
		let radius = 40
		let steering = createVector()
		let influencer = 0
		for (const _boid of boids) {
			if (this.pos.dist(_boid.pos) < radius) {
				steering.add(_boid.vel)
				influencer++
			}
		}
		if (influencer > 0) {
			steering.div(influencer)
			steering.setMag(this.maxSpeed)
			steering.sub(this.vel)
			steering.limit(this.maxForce)
		}
		return steering
	}

	cohesion() {
		let radius = 50
		let steering = createVector()
		let influencer = 0
		for (const _boid of boids) {
			if (this.pos.dist(_boid.pos) < radius) {
				steering.add(_boid.pos)
				influencer++
			}
		}
		if (influencer > 0) {
			steering.div(influencer)
			steering.sub(this.pos)
			steering.limit(this.maxForce)
		}
		return steering
	}

	separation() {
		let radius = 20
		let steering = createVector()
		let influencer = 0
		for (const _boid of boids) {
			let d = this.pos.dist(_boid.pos)
			if (d < radius) {
				let diff = p5.Vector.sub(this.pos, _boid.pos)
				d !== 0 ? diff.div(d) : null
				steering.add(diff)
				influencer++
			}
		}
		if (influencer > 0) {
			steering.div(influencer)
			steering.setMag(this.maxSpeed)
			// steering.sub(this.vel)
			steering.limit(this.maxForce + 0.2)
		}
		return steering
	}

	applyForces() {
		// 0.8
		this.acc.add(this.align().mult(alignSlider.value()))
		// 0.4
		this.acc.add(this.cohesion().mult(cohesionSlider.value()))
		// 0.5
		this.acc.add(this.separation().mult(separationSlider.value()))

		let ray2 = createVector(cos(this.angle - 80), sin(this.angle - 80))
		let ray1 = createVector(cos(this.angle + 80), sin(this.angle + 80))
		// stroke('green')
		// strokeWeight(1)
		// line(this.pos.x, this.pos.y, ray1.x, ray1.y)
		// line(this.pos.x, this.pos.y, ray2.x, ray2.y)

		// Apply wall repulsion
		for (const _wall of walls) {
			this.wallRepulsion(_wall, this.vel)
			this.wallRepulsion(_wall, ray1)
			this.wallRepulsion(_wall, ray2)
		}

		// this.acc.setMag(0.07)
	}

	wallRepulsion(wall, ray) {
		let intersectInfo = intersectTest(wall, this.pos, ray)
		if (intersectInfo.state) {
			// strokeWeight(15)
			// stroke('blue')
			// point(wallCenter.x, wallCenter.y)
			let wallVector = createVector(wall.b.x - wall.a.x, wall.b.y - wall.a.y)
			let wallCenter = createVector(wall.a.x + wallVector.x / 2, wall.a.y + wallVector.y / 2)

			let wallVectorAngle = wallVector.heading()
			let normal1 = createVector(cos(wallVectorAngle + 90), sin(wallVectorAngle + 90))
			let normal2 = createVector(cos(wallVectorAngle - 90), sin(wallVectorAngle - 90))

			let distFactor = 1 - intersectInfo.dist / wallRepulsionRange
			// if (ray === this.vel) {
			// 	distFactor *= 2
			// }
			if (this.pos.dist(createVector(wallCenter.x + normal1.x, wallCenter.y + normal1.y)) < this.pos.dist(createVector(wallCenter.x + normal2.x, wallCenter.y + normal2.y))) {
				this.acc.add(normal1).setMag(Math.exp(distFactor * 1.2) * 0.06)
			} else {
				this.acc.add(normal2).setMag(Math.exp(distFactor * 1.2) * 0.06)
			}
			// console.log(distFactor, Math.exp(distFactor * 1.2) * 0.1)
		}
	}

	move() {
		this.vel.add(this.acc)
		this.pos.add(this.vel)
		// this.vel.limit(5)
		this.acc.mult(0)

		// Wall teleport
		this.pos.x < 0 ? (this.pos.x = width) : null
		this.pos.x > width ? (this.pos.x = 0) : null
		this.pos.y < 0 ? (this.pos.y = height) : null
		this.pos.y > height ? (this.pos.y = 0) : null
	}

	draw() {
		this.angle = degrees(this.vel.heading())

		const triangle = [
			{ x: this.pos.x + this.triangleRadius * cos(this.angle), y: this.pos.y + this.triangleRadius * sin(this.angle) },
			{ x: this.pos.x + this.triangleRadius * cos(this.angle + 150), y: this.pos.y + this.triangleRadius * sin(this.angle + 150) },
			{ x: this.pos.x + this.triangleRadius * cos(this.angle - 150), y: this.pos.y + this.triangleRadius * sin(this.angle - 150) },
		]

		stroke('black')
		strokeWeight(1)
		line(triangle[0].x, triangle[0].y, triangle[1].x, triangle[1].y)
		line(triangle[1].x, triangle[1].y, triangle[2].x, triangle[2].y)
		line(triangle[2].x, triangle[2].y, triangle[0].x, triangle[0].y)
	}
}
