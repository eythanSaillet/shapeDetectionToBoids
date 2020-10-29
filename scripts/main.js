let mouse,
	selectZone = [],
	activeZone = [],
	boids = [],
	walls = [],
	alignSlider,
	cohesionSlider,
	separationSlider

function setup() {
	createCanvas(750, 750).parent('canvasContainer')
	angleMode(DEGREES)

	for (let i = 0; i < 150; i++) {
		boids.push(new Boid())
	}

	// Border walls
	walls.push(new Wall(0, 0, width - 0, 0))
	walls.push(new Wall(0, height - 0, width - 0, height - 0))
	walls.push(new Wall(0, 0, 0, height - 0))
	walls.push(new Wall(width - 0, 0, width - 0, height - 0))
	walls.push(new Wall(width / 2, 150, width / 2, 450))

	mouse = {
		clickedPos: createVector(),
	}

	// Slider boids
	alignSlider = createSlider(0, 5, 0.8, 0.1)
	cohesionSlider = createSlider(0, 5, 0.4, 0.1)
	separationSlider = createSlider(0, 5, 0.6, 0.1)
}

function draw() {
	background(220)

	// Boids
	for (const _boid of boids) {
		_boid.applyForces()
		_boid.move()
		_boid.draw()
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
		// stroke('black')
		// strokeWeight(1)
		// noFill()
		// rect(_zone[0], _zone[1], _zone[2], _zone[3])
	}
}

function mousePressed() {
	mouse.clickedPos = createVector(mouseX, mouseY)
}

function mouseReleased() {
	activeZone.push(selectZone)
	walls.push(new Wall(selectZone[0], selectZone[1], selectZone[2], selectZone[1]))
}

// function mouseMoved() {
// 	boids[0].vel.x = mouseX - width / 2
// 	boids[0].vel.y = mouseY - height / 2

// 	boids[0].vel.normalize()

// 	console.log(intersectTest(walls[0], boids[0].pos, boids[0].vel))
// }
