const path = require('path');
const { node } = require('webpack');
const webpack = require('webpack')

module.exports = {
    target: 'node',
    entry: {
        grader: './src/grader/js/grader.ts',
        metadata: './src/grader/js/metadata.ts',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'build/dist'),
        clean: true,
    },
    module: {
        rules: [{
            test: /\.(js|ts)x?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                presets: [
                    '@babel/preset-env', 
                    '@babel/preset-react',
                    '@babel/preset-typescript'
                ]
            }
        },
		{
			test: /\.css/,
			use: [
				'style-loader',
				'css-loader'
			]
		}
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        fallback: {"buffer": require.resolve("safe-buffer/") },
    }
};
