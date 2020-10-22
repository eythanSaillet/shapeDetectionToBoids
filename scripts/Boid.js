class Boid {
	constructor() {
		this.pos = createVector(random(width), random(height))
		this.vel = p5.Vector.random2D()
		this.acc = p5.Vector.random2D()

		this.maxSpeed = 3
		this.maxForce = 0.2
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
		stroke('green')
		strokeWeight(7)
		point(this.pos.x, this.pos.y)
	}
}
