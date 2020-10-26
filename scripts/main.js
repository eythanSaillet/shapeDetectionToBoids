let mouse,
	selectZone = [],
	activeZone = [],
	boids = [],
	walls = []

function setup() {
	createCanvas(750, 750).parent('canvasContainer')
	angleMode(DEGREES)

	for (let i = 0; i < 5; i++) {
		boids.push(new Boid())
	}

	console.log(walls)
	walls.push(new Wall(500, 50, 500, 650))
	walls.push(new Wall(150, 700, 400, 700))

	mouse = {
		clickedPos: createVector(),
	}
}

function draw() {
	background(220)

	// Boids
	for (const _boid of boids) {
		_boid.applyForces()
		_boid.move()
		_boid.draw()
		line(boids[0].pos.x, boids[0].pos.y, boids[0].pos.x + boids[0].vel.x * 1000, boids[0].pos.y + boids[0].vel.y * 1000)
	}

	// Draw walls
	for (const _wall of walls) {
		_wall.draw()
	}

	// Draw select zone
	if (mouseIsPressed) {
		stroke('red')
		strokeWeight(3)
		fill('rgba(255, 0, 0, 0.4)')

		mouse.pos = createVector(mouseX, mouseY)

		rect(mouse.clickedPos.x, mouse.clickedPos.y, mouse.pos.x - mouse.clickedPos.x, mouse.pos.y - mouse.clickedPos.y)
		selectZone = [mouse.clickedPos.x, mouse.clickedPos.y, mouse.pos.x - mouse.clickedPos.x, mouse.pos.y - mouse.clickedPos.y]
	}

	// Draw active zone
	for (const _zone of activeZone) {
		rect(_zone[0], _zone[1], _zone[2], _zone[3])
	}
}

function mousePressed() {
	mouse.clickedPos = createVector(mouseX, mouseY)
}

function mouseReleased() {
	activeZone.push(selectZone)
}

// function mouseMoved() {
// 	boids[0].vel.x = mouseX - width / 2
// 	boids[0].vel.y = mouseY - height / 2

// 	boids[0].vel.normalize()

// 	console.log(intersectTest(walls[0], boids[0].pos, boids[0].vel))
// }
