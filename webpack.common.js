const path = require('path')

module.exports = {
	entry: {
		editor: './src/editor/js/index.jsx',
	},
    output: {
        filename: '[name].bundle.js',
		path: path.join(__dirname,'build/dist'),
		clean: true,
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
            }
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
