const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const WebpackCdnPlugin = require('webpack-cdn-plugin');

module.exports = merge(common, {
	mode: 'production',

	plugins: [
		new WebpackCdnPlugin({
			modules: [
				  {
					name: 'p5',
					var: 'p5',
				}
			],
			prod: true
		})
	]
});