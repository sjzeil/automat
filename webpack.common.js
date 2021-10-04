const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        editor: './src/editor/js/index.jsx',
        grader: './src/grader/js/grader.ts',
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
