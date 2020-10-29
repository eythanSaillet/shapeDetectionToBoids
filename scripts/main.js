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

		line(mouse.clickedPos.x, mouse.clickedPos.y, mouse.pos.x, mouse.pos.y)
	}
}

function mousePressed() {
	mouse.clickedPos = createVector(mouseX, mouseY)
}

function mouseReleased() {
	activeZone.push(selectZone)
	walls.push(new Wall(mouse.clickedPos.x, mouse.clickedPos.y, mouse.pos.x, mouse.pos.y))
}
