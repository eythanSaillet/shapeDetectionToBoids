let mouse,
	selectZone = [],
	activeZone = [],
	boids = [],
	walls = [],
	alignSlider,
	cohesionSlider,
	separationSlider

function setup() {
	createCanvas(1280, 720).parent('canvasContainer')
	angleMode(DEGREES)

	for (let i = 0; i < 150; i++) {
		boids.push(new Boid())
	}

	// Create basic wall
	wallClear()

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

function wallClear() {
	walls = []
	walls.push(new Wall(0, 0, width - 0, 0))
	walls.push(new Wall(0, height - 0, width - 0, height - 0))
	walls.push(new Wall(0, 0, 0, height - 0))
	walls.push(new Wall(width - 0, 0, width - 0, height - 0))
}

function drawWallFromData() {
	window
		.fetch('scripts/data.json')
		.then((_response) => _response.json())
		.then((_walls) => {
			// console.log(_walls)
			if (_walls.length > 0) {
				console.log('not empty')
				for (const _wall of _walls) {
					for (let i = 0; i < _wall.length; i++) {
						if (i !== _wall.length - 1) {
							// let point = _point[0]
							// console.log(_wall[i][0])
							walls.push(new Wall(_wall[i][0][0], _wall[i][0][1], _wall[i + 1][0][0], _wall[i + 1][0][1]))
						}
					}
				}
			}
		})
}

let drawWallInterval = setInterval(() => {
	wallClear()
	drawWallFromData()
}, 1000)
