let mouse
let boids = []

function setup() {
	createCanvas(750, 750).parent('canvasContainer')

	for (let i = 0; i < 250; i++) {
		boids.push(new Boid())
	}
}

function draw() {
	background(220)

	for (const _boid of boids) {
		_boid.applyForces()
		_boid.move()
		_boid.draw()
	}
}
