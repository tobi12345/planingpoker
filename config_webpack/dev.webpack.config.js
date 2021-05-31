const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const getEnvs = require("./getEnvs")
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const getPort = require("get-port")

module.exports = async (envs) => {
	const envPort = envs.port ?? 3000
	const ports = new Set([envPort, 3000, 3001, 3002])

	const port = await getPort({ port: Array.from(ports.values()) })

	return {
		mode: "development",
		entry: path.resolve(__dirname, "..", "dist", `ui-${envs.project}`, "index.js"),
		output: {
			path: path.resolve(__dirname, "..", `dist_ui_${envs.project}`),
			filename: "bundle.js",
			chunkFilename: "[id].js",
			publicPath: "/",
		},
		plugins: [
			new ReactRefreshWebpackPlugin(),
			new webpack.DefinePlugin(getEnvs(path.resolve(__dirname, "..", `${envs.project}.env`))),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, "..", "src", `ui-${envs.project}`, "public", "index.html"),
				filename: "index.html",
				inject: "body",
			}),
			new FaviconsWebpackPlugin(path.resolve(__dirname, "..", "assets", "ace-of-diamonds.png")),
		],
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader"],
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					use: ["file-loader"],
				},
			],
		},
		devtool: "inline-source-map",
		devServer: {
			hot: true,
			clientLogLevel: "none",
			noInfo: true,
			open: true,
			port,
			host: "0.0.0.0",
			onListening: function (server) {
				const port = server.listeningApp.address().port
				console.log("Listening on port:", port)
			},
			watchOptions: {
				ignored: [/node_modules/],
			},
			historyApiFallback: true,
			disableHostCheck: true,
		},
	}
}
