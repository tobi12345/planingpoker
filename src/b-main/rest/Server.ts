import express from "express"
import * as http from "http"
import morgan from "morgan"
import * as bodyParser from "body-parser"
import cors from "cors"
import { Auth } from "./Auth"
import { IStuff } from "../index"
import { GamesRouter } from "./GamesRouter"
import WebSocket from "ws"

export const Server = (stuff: IStuff) => {
	const { config } = stuff
	const app = express()
	app.use(cors())
	app.use(morgan("dev"))
	app.use(bodyParser.json())
	app.disable("x-powered-by")

	app.use("/games", GamesRouter(stuff))
	app.use(Auth(stuff))

	const server = http.createServer(app)

	const socketServer = new WebSocket.Server({ server })
	socketServer.on("connection", function connection(ws) {
		ws.on("message", function incoming(message) {
			console.log("received: %s", message)
		})

		ws.send("something")
	})

	const start = () => {
		return new Promise<void>((resolve) => {
			server.listen(config.rest.port, () => {
				console.log(`server is running on port ${config.rest.port}`)
				resolve()
			})
		})
	}

	const close = async () => {
		return new Promise<void>((resolve, reject) => {
			server.close((error) => {
				if (error) {
					return reject(error)
				}
				resolve()
			})
		})
	}

	return {
		start,
		close,
		app,
	}
}
