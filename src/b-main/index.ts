import { IDatabaseBaseClient } from "postgres-schema-builder"
import { configFromEnv, IConfig } from "./config"
import { connectAndSetupDatabase } from "../database/database"
import { Server } from "./rest/Server"
import { IServices, Services } from "../database/services/Services"
import { loadEnvFromDotenv } from "../b-shared/utils/loadEnvFromDotenv"
import { onShutdown } from "../b-shared/onShutdown"
import { Games } from "./Games"

require("source-map-support").install()

const nodeEnv = process.env.NODE_ENV
console.info(`[ENV] is ${nodeEnv}`)

export interface IStuff {
	database: IDatabaseBaseClient
	services: IServices
	config: IConfig
	games: Games
}

loadEnvFromDotenv(nodeEnv || "development")
;(async () => {
	const config = configFromEnv()

	const { database, schema } = await connectAndSetupDatabase(config.database)
	console.info(`[DATABASE] connected and initialized (v${schema.getVersion()})`)

	const services = Services({ database })

	const stuff: IStuff = {
		config,
		database,
		services,
		games: Games(),
	}

	const server = Server(stuff)
	await server.start()

	await onShutdown()
	await server.close()
	await database.close()
})()
