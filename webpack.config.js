var path = require("path");

module.exports = {
	entry: "./scripts/index.js",
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		loaders: [
			{
				test: /\,css$/,
				loader: "style!css"
			}
		]
	}
};