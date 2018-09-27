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
	}

	p.toDelaunay = () => {
		img.loadPixels();
		points = [];
		let xx, yy;
		for(let i = 0; i < amount; i++){
			xx = Math.round(Math.random() * img.width);
			yy = Math.round(Math.random() * img.height);
			points.push([xx, yy]);
		}
		delaunay = Delaunator.from(points);
		p.drawTriangles();
	}

	p.drawTriangles = () => {
		p.clear();
		

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
		let c1 = [];
		let c2 = [];
		let c3 = [];

		function forEachTriangle(ppp, ddd) {
			for (let t = 0; t < ddd.triangles.length / 3; t++) {
				tr = pointsOfTriangle(ddd, t).map(pnt => ppp[pnt]);
				
				pix = (tr[0][1] * img.width + tr[0][0]) * 4;
				c1 = [img.pixels[pix], img.pixels[pix+1], img.pixels[pix+2]];

				pix = (tr[1][1] * img.width + tr[1][0]) * 4;
				c2 = [img.pixels[pix], img.pixels[pix+1], img.pixels[pix+2]];

				pix = (tr[2][1] * img.width + tr[2][0]) * 4;
				c3 = [img.pixels[pix], img.pixels[pix+1], img.pixels[pix+2]];

				p.fill(averageColor(c1, c2, c3));
				p.stroke(averageColor(c1, c2, c3));
				p.triangle(tr[0][0], tr[0][1], tr[1][0], tr[1][1], tr[2][0], tr[2][1]);
			}
		}
		forEachTriangle(points, delaunay);
		/*for (let e = 0; e < delaunay.triangles.length; e++) {
			if (e > delaunay.halfedges[e]) {
				const pp = points[delaunay.triangles[e]];
				const qq = points[delaunay.triangles[nextHalfedge(e)]];
				p.line(pp[0], pp[1], qq[0], qq[1]);
			}
		}*/
	}

	p.setVerticesAmount = (q) => {
		amount = q;
		p.toDelaunay();
	}
}