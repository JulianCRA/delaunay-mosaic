import Delaunator from 'delaunator';
import p5 from 'p5';

const extlibs = () => {
	if(process.env.NODE_ENV !== 'production')
		return ({p5: 'p5'});
	else
		return ({});
}

console.log(extlibs());

const sk = (p) => {
	p.setup = () => {
		p.createCanvas(500, 500);
		p.background(120);
	}
}

new p5(sk, 'sketch');