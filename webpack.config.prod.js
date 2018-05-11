const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const postcssUrl = require('postcss-url');
const CompressionPlugin = require('compression-webpack-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const postcssPlugins = function () {
	// safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
	const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
	const minimizeOptions = {
		autoprefixer: false,
		safe: true,
		mergeLonghand: false,
		discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
	};
	return [
		postcssUrl({
			url: (URL) => {				
				// Only convert root relative URLs, which CSS-Loader won't process into require().
				if (!URL.startsWith('/') || URL.startsWith('//')) {
					return URL;
				}

				if (deployUrl.match(/:\/\//)) {
					// If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
					return `${deployUrl.replace(/\/$/, '')}${URL}`;
				}
				else if (baseHref.match(/:\/\//)) {
					// If baseHref contains a scheme, include it as is.
					return baseHref.replace(/\/$/, '') +
					`/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
				}
				else {
					// Join together base-href, deploy-url and the original URL.
					// Also dedupe multiple slashes into single ones.
					return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
				}
			}
		}),
		autoprefixer(),
	];
}

var plugins = [
	new webpack.DefinePlugin({
		__isBrowser__: "true"
	}),
	new ProgressPlugin(),
	new webpack.optimize.UglifyJsPlugin({ 
		mangle: false, 
		sourcemap: false,
		compress: {
	        warnings: false,
	        pure_getters: true,
	        unsafe: true,
	        unsafe_comps: true,
	        screw_ie8: true
      	}
	}),
	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.optimize.AggressiveMergingPlugin(),
	new CompressionPlugin({
		asset: "[path].gz[query]",
		algorithm: "gzip",
		test: /\.js$|\.styl$|\.css$|\.html$|\.scss$/,
		threshold: 10240,
		minRatio: 0
	})
]

var browserConfig = {
	entry: {
		main: ['./src/browser/index.js'],
		styles: ['./src/style.scss']
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: '[name].bundle.js',
		publicPath: '/public'
	},
	module: {
		rules: [
			{ test: /\.(js)$/, use: 'babel-loader' },
			{
				exclude: [
					__dirname+"/src/style.scss"
				],
				test: /\.css$/,
				use: [
					"exports-loader?module.exports.toString()",
					{
						loader: "css-loader",
						options: {
							sourceMap: false,
							importLoaders: 1
						}
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							plugins: postcssPlugins
						}
					}
				]
			},
			{
				exclude: [
					__dirname+"/src/style.scss"
				],
				test: /\.scss$/,
				use: [
					"exports-loader?module.exports.toString()",
					{
						loader: "css-loader",
						options: {
							sourceMap: false,
							importLoaders: 1
						}
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							plugins: postcssPlugins
						}
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: false,
							paths: []
						}
					}
				]
			},
			{
				include: [
					__dirname+"/src/style.scss"
				],
				test: /\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: false,
							importLoaders: 1
						}
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							plugins: postcssPlugins
						}
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: false,
							paths: []
						}
					}
				]
			},
			{
				include: [
					__dirname+"/src/style.scss"
				],
				test: /\.scss$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: false,
							importLoaders: 1
						}
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							plugins: postcssPlugins
						}
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: false,
							paths: []
						}
					}
				]

			},
			{
				test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|cur|ani)$/,
				loader: "url-loader?name=[name].[hash:20].[ext]&limit=10000"
			}
		]
	},
	plugins: plugins
}

var serverConfig = {
	entry: './src/server/index.js',
	target: 'node',
	externals: [nodeExternals()],
	output: {
		path: __dirname,
		filename: 'server.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{ test: /\.(js)$/, use: 'babel-loader' }
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			__isBrowser__: "false"
		})
	]
}

module.exports = [browserConfig, serverConfig]