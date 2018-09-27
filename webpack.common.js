const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'build');

module.exports = {
/**/entry: {
		mosaic: path.join(srcPath, "app.js"),
	},

/**/plugins: [
		new HtmlWebpackPlugin({
			template: path.join(srcPath, "index.html"),
			title: "Delaunay Mosaic",
		})
	],

/**/output: {
		path: buildPath,
		filename: '[name].bundle.js',
	},
};