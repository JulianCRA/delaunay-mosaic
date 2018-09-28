import Delaunator from 'delaunator';
import p5 from 'p5';

let img64;
let p5instance;

let handleFileSelect = (evt) => {
	let file = evt.target.files[0];
	let reader;

	if (file.type.match("image.*")) {
		reader = new FileReader();
		reader.onload = (e) => {
			img64 = e.target.result; 
			if(p5instance)	p5instance.remove();
			p5instance = new p5(sketch, 'sk');
			window.p5instance = p5instance;
		};
	}

	reader.readAsDataURL(file);
}

document.getElementById("file").addEventListener("change", handleFileSelect, false);
document.getElementById("gobtn").addEventListener("click", go, false);
document.getElementById("qvertices").addEventListener("input", setQ, false);
//document.getElementById("qvertices").addEventListener("change", setQ, false);

function go(){
	p5instance.toDelaunay();
}

function setQ(){
	p5instance.setVerticesAmount(this.value);
}

let sketch = (p) => {
	let img, _WIDTH, _HEIGHT, points, amount, delaunay;

	p.preload = () => {
		img = p.loadImage(img64, () => {
			_WIDTH = img.width;
			_HEIGHT = img.height;
		})
	}

	p.setup = () => {
		amount = 5000;
		p.createCanvas(_WIDTH, _HEIGHT);
		p.image(img, 0, 0);
		img.loadPixels();
	}

	p.toDelaunay = () => {
		
		points = [];
		let xx, yy;
		for(let i = 0; i < amount; i++){
			xx = Math.round(Math.random() * img.width);
			yy = Math.round(Math.random() * img.height);
			points.push([xx, yy]);
		}
		delaunay = Delaunator.from(points);
		//console.log(delaunay.triangles);
		p.drawTriangles();
	}

	p.drawTriangles = () => {
		p.clear();
		p.noStroke();

		function averageColor(c1, c2, c3){
			return [(c1[0]+c2[0]+c3[0])/3, (c1[1]+c2[1]+c3[1])/3, (c1[2]+c2[2]+c3[2])/3, 255];
		}

		function edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }

		function pointsOfTriangle(ddd, t) {
			return edgesOfTriangle(t)
				.map(e => ddd.triangles[e]);
		}

		img.loadPixels();
		let tr;
		let pix;
		
		function forEachTriangle(ppp, ddd) {
			for (let t = 0; t < ddd.triangles.length / 3; t++) {
				tr = pointsOfTriangle(ddd, t).map(pnt => ppp[pnt]);
				
				let xx = Math.round((tr[0][0]+tr[1][0]+tr[2][0])/3);
				let yy = Math.round((tr[0][1]+tr[1][1]+tr[2][1])/3);
				pix = (yy * img.width + xx) * 4
				p.fill(img.pixels[pix], img.pixels[pix+1], img.pixels[pix+2], 255);

				p.triangle(tr[0][0], tr[0][1], tr[1][0], tr[1][1], tr[2][0], tr[2][1]);
			}
		}
		forEachTriangle(points, delaunay);

	}

	p.setVerticesAmount = (q) => {
		amount = q;
		p.toDelaunay();
	}
}