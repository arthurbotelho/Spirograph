class Circle{
	constructor(center = {x: 0, y :0}, radius = 10, color = "#ffffff50" ) {
		this.center = center
		this.radius = radius
		this.color = color 
	}

	updatePosition(newCenter){
		this.center = newCenter
	}

	updateRadius(newRadius){
		this.radius = newRadius
	}

	centerToPoint(destiny = {x: 0, y: 0}){
		line(this.center.x,this.center.y, destiny.x, destiny.y)
	}

	display() {
		push()
		//center
		fill(255)
		circle(this.center.x, this.center.y, 2)

		noFill()
		stroke(this.color)
		circle(this.center.x, this.center.y, this.radius)
		pop()
	}
	translateCircle(){
		let d = ceil(dist(translateWidth-mouseX, translateHeight-mouseY, staticCircle.center.x, staticCircle.center.y))
		if(d <= (staticCircle.radius*zoom)){
			translateWidth = mouseX
			translateHeight = mouseY
		}
	}
}

let R = 200
let r = 105
let pen = 5
let BASE_VEL = -(R - r) / r
let perimeter = 200

let t = 1
let zoom = 1;
let currentPoints = []

let currentColor = "#00ff406f"
let savedForms = [{ points: [], color: "" }]

let translateWidth, translateHeight
var staticCircle = new Circle({x:0,y:0}, R, "#ff354570")
var orbitCircle = new Circle()
var penCircle = new Circle({x:0,y:0}, 2)

function setup(){
	createCanvas(windowWidth, windowHeight)
	frameRate(30)
	translateWidth = width/2
	translateHeight = height/2
	ellipseMode(RADIUS)
}

function mouseDragged() {
	staticCircle.translateCircle()
}

function mouseWheel(event) {
	print(zoom)
	
	//change the zoom +- 0.05 per scroll
	zoom = Math.abs(zoom+((event.delta/Math.abs(event.delta))*0.05))
	
	//uncomment to block page scrolling
	return false;
  }
function draw() {
	translate(translateWidth, translateHeight)
	scale(zoom)
	//update values read from rangeSliders
	R = updatedValues.staticCircle
	r = updatedValues.dynamicCircle
	pen = updatedValues.pen
	speed = updatedValues.speed
	perimeter = updatedValues.perimeter
	BASE_VEL = -(R - r) / r
	currentColor = updatedValues.color+"90"
	 
	staticCircle.updateRadius(R)
	orbitCircle.updateRadius(r)

	let fps = 0;
	do{
		background("#000")
		fps++
		let delta = TWO_PI/100;
		if(speed != 0)
			t += delta


		stroke("#ffffff50")
		//Static Circle
		staticCircle.display()

		//Rotating Circle
		//Center of rotating circle
		var rx = ((R-r) * Math.cos(t))
		var ry = ((R-r) * Math.sin(t))
		orbitCircle.updatePosition({x: rx, y: ry})
		orbitCircle.display()
		orbitCircle.centerToPoint(staticCircle.center)


		//Endpoint from where the line will be drawn
		let p = {x: 0, y: 0}
		let noff = parseFloat(updatedValues.offset)
		p.x = rx + ((r  * pen / 100) * Math.cos(t * (BASE_VEL*noff)))
		p.y = ry + ((r  * pen / 100) * Math.sin(t * (BASE_VEL*noff)))
		penCircle.updatePosition(p)
		if(speed != 0)
			currentPoints.unshift(p)
			
		//pen point
		penCircle.display()
		penCircle.centerToPoint(orbitCircle.center)
		
		//delete points beyond perimeter
		while (currentPoints.length > perimeter) currentPoints.pop()

		
			
	}while(fps < speed)

	printSavedForms()
	printCurrent()

}

function printCurrent() {
	push()
		beginShape()

		stroke(currentColor)
		strokeWeight(2)	
		noFill()
		for (let i = 0; i < currentPoints.length; i++) {
			vertex(currentPoints[i].x, currentPoints[i].y)
		}
		endShape(CLOSE)
	pop()
}

function printSavedForms() {
	
	for (let forms = 0; forms < savedForms.length; forms++) {
		let { points: cPoints, color } = savedForms[forms]
		beginShape()
		stroke(color)
		strokeWeight(2)
		noFill()
		for (let i = 0; i < cPoints.length; i++) {
			vertex(cPoints[i].x, cPoints[i].y)
		}
		endShape()
	}

}


