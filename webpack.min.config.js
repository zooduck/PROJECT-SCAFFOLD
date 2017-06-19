var path = require("path");

module.exports = {
	entry: "./scripts/index.js",
	output: {
		filename: 'bundle.min.js',
		path: path.resolve(__dirname, 'dist')
	}
};