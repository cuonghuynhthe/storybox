var webpack = require('webpack');
module.exports = {
	entry: './client.js',
	output: {
		filename: 'bundle.js',
		path: 'public'
	},
	module: {
		 loaders: [
		 	{
		 		test: /\.jsx$/,
		 		exclude: /node_modules/,
		 		loader: 'babel-loader',
		 		query: {
		 			presets: ['es2015', 'react']
		 		}	
		 	}
		]
	}
}