import { configFromEnv, IConfig } from "./config"
import { Server } from "./rest/Server"
import { loadEnvFromDotenv } from "../b-shared/utils/loadEnvFromDotenv"
import { onShutdown } from "../b-shared/onShutdown"
import { GameUpdateService } from "./GameUpdateService"
import { Games } from "./Games"

require("source-map-support").install()

const nodeEnv = process.env.NODE_ENV
console.info(`[ENV] is ${nodeEnv}`)

export interface IStuff {
	config: IConfig
	games: Games
	gameUpdateService: GameUpdateService
}

loadEnvFromDotenv(nodeEnv || "development")
;(async () => {
	const config = configFromEnv()

	const stuff: IStuff = {
		config,
		games: Games(),
		gameUpdateService: GameUpdateService(),
	}

	const server = Server(stuff)
	await server.start()

	await onShutdown()
	await server.close()
})()
