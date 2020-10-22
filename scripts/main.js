let mouse,
	selectZone = [],
	activeZone = [],
	boids = []

function setup() {
	createCanvas(750, 750).parent('canvasContainer')

	for (let i = 0; i < 250; i++) {
		boids.push(new Boid())
	}

	mouse = {
		clickedPos: createVector(),
	}
}

function draw() {
	background(220)

	// for (const _boid of boids) {
	// 	_boid.applyForces()
	// 	_boid.move()
	// 	_boid.draw()
	// }

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
