class Boid {
	constructor() {
		this.pos = createVector(random(width), random(height))
		this.vel = p5.Vector.random2D()
		this.acc = p5.Vector.random2D()

		this.maxSpeed = 3
		this.maxForce = 0.15
		this.triangleRadius = 10
	}

	align() {
		let radius = 30
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
		let radius = 40
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
		let radius = 15
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
		this.acc.add(this.align())
		this.acc.add(this.cohesion())
		this.acc.add(this.separation())

		for (const _wall of walls) {
			let intersectInfo = intersectTest(_wall, this.pos, this.vel)
			if (intersectInfo !== null) {
				let repulsion = createVector(this.pos.x, this.pos.y, intersectInfo[1].x, intersectInfo[1].y)
				let test = createVector(0, 1)
				// repulsion.reflect()
				// repulsion.setMag(0.5)
				// repulsion.limit(this.maxForce)
				// this.acc.add(repulsion)

				function dotProduct(vec1, vec2) {
					// get the dot product of this and {avec}
					return vec2.x * vec1.x + vec2.y * vec1.y // returns number
				}
				let len = dotProduct(test.normalize(), repulsion) * 2
				let reflect = createVector(test.x * len - repulsion.x, test.y * len - repulsion.y)
				// console.log(reflect)
				reflect.setMag(1)
				reflect.limit(this.maxForce)
				this.acc.add(reflect)

				stroke('green')
				strokeWeight(3)
				line(intersectInfo[1].x, intersectInfo[1].y, intersectInfo[1].x + reflect.x * 500, intersectInfo[1].y + reflect.y * 500)
			}
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
		let angle = degrees(this.vel.heading())

		const triangle = [
			{ x: this.pos.x + this.triangleRadius * cos(angle), y: this.pos.y + this.triangleRadius * sin(angle) },
			{ x: this.pos.x + this.triangleRadius * cos(angle + 150), y: this.pos.y + this.triangleRadius * sin(angle + 150) },
			{ x: this.pos.x + this.triangleRadius * cos(angle - 150), y: this.pos.y + this.triangleRadius * sin(angle - 150) },
		]

		stroke('black')
		strokeWeight(1)
		line(triangle[0].x, triangle[0].y, triangle[1].x, triangle[1].y)
		line(triangle[1].x, triangle[1].y, triangle[2].x, triangle[2].y)
		line(triangle[2].x, triangle[2].y, triangle[0].x, triangle[0].y)
	}
}
