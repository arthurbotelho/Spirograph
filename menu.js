var ranges
var updatedValues = {}

document.addEventListener("DOMContentLoaded", () => {
	ranges = document.querySelectorAll("input[type=range]")
	ranges.forEach((input) => {
		var currentInput = input
		let currentValue = document.querySelector(`#${input.id}-value`)
		//update initial values

		updatedValues[currentInput.id] = parseInt(currentInput.min) + Math.floor((parseInt(currentInput.max) - parseInt(currentInput.min)) * Math.random());
		currentValue.textContent = updatedValues[currentInput.id]
		currentInput.value = updatedValues[currentInput.id]

		//offset is a float number so must be setted manually
		if (currentInput.id == "offset") {
			currentValue.textContent = -1.0
			currentInput.value = -1.0
		}

		var listener = () => {
			window.requestAnimationFrame(() => {
				//value
				currentValue.textContent = currentInput.value;
				updatedValues[currentInput.id] = currentInput.value;


			});
		};

		currentInput.addEventListener("mousedown", () => {
			listener();
			currentInput.addEventListener("mousemove", listener);
		});

		currentInput.addEventListener("mouseup", () => {
			currentInput.removeEventListener("mousemove", listener);
		});

		currentInput.addEventListener("keydown", listener);
	})

	let newRanges = {}
	ranges.forEach((input) => {
		newRanges[input.id] = input
	})
	ranges = newRanges


	//select color picker
	let colorPicker = document.querySelector("#path-color")
	colorPicker.value = "#10ff5a"
	updatedValues.color = colorPicker.value
	colorPicker.addEventListener("change", (event)=>{
		updatedValues = {...updatedValues, 'color': event.target.value }
	})


});



function saveForm() {
	let newform = { points: [], color: currentColor }
	for (let i = 0; i < currentPoints.length; i++) {
		newform.points.unshift({ x: currentPoints[i].x, y: currentPoints[i].y })
	}
	savedForms.push(newform)
}
function clearFormStack(){
	savedForms.pop()
}
function saveSvg() {
	let svgpath = ""

	let { x, y } = currentPoints[0];
	let strokeWidth = 1
	let xmin = 2000, ymin = 2000, xmax = -2000, ymax = -2000;

	//currentPoints
	svgpath = `<path stroke="${currentColor}" stroke-width="${strokeWidth}" fill="none" d="M ${x.toFixed(4)} ${y.toFixed(4)}`
	for (let i = 1; i < currentPoints.length; i++) {
		let { x, y } = currentPoints[i]
		xmin = x < xmin ? x : xmin;
		ymin = y < ymin ? y : ymin;
		xmax = x > xmax ? x : xmax;
		ymax = y > ymax ? y : ymax;

		svgpath += `L ${(x).toFixed(4)} ${(y).toFixed(4)}`
	}
	svgpath += `" />`

	savedForms.forEach(saved => {
		let newSvgPath = ""
		let { color, points: cPoints } = saved

		if (cPoints.length > 0) {
			console.log(savedForms);
			newSvgPath = `<path stroke="${color}" stroke-width="${strokeWidth}" fill="none" 
				d="M ${cPoints[0].x.toFixed(4)} ${cPoints[0].y.toFixed(4)} `
			for (let i = 1; i < cPoints.length; i++) {
				let { x, y } = cPoints[i]
				xmin = x < xmin ? x : xmin;
				ymin = y < ymin ? y : ymin;
				xmax = x > xmax ? x : xmax;
				ymax = y > ymax ? y : ymax;

				newSvgPath += `L ${(x).toFixed(4)} ${(y).toFixed(4)}`
			}
			newSvgPath += `" />`
			svgpath += newSvgPath
		}
	})

	let vbWidth = ceil(xmax - xmin) + 4 * strokeWidth,
		vbHeight = ceil(ymax - ymin) + 4 * strokeWidth

	let author = `<!-- 	author: Arthur Botelho
		github: https://github.com/arthurbotelho/Spirograph
		-->`
	let header = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="${-vbWidth / 2} ${-vbHeight / 2} ${vbWidth} ${vbHeight}">`

	let closing = `</svg>`
	var blob = new Blob([author, header, svgpath, closing], { type: "image/svg+xml" })
	//saveAs.saveAs(blob, "spirograph.svg")
	saveIMG("spirograph.svg", blob)
}
const saveIMG = function (filename, data) {
	var blob = data
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveBlob(blob, filename);
	}
	else {
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = filename;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}
