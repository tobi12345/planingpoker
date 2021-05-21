import {
	DatabaseClient,
	SQL,
	Query,
	DatabaseSchema,
	composeCreateTableStatements,
	IDatabaseClient,
} from "postgres-schema-builder"
import { Pool } from "pg"
import { Tables } from "./tables"
import { migrations } from "./migrations"

export interface IDatabaseConfig {
	host: string
	port: number
	database: string
	user: string
	password?: string
	clear: boolean
}

const clearDatabase = async (database: IDatabaseClient, databaseUser: string) => {
	await database.query({
		sql:
			`DROP SCHEMA public CASCADE;` +
			`CREATE SCHEMA public;` +
			`GRANT ALL ON SCHEMA public TO ${databaseUser};` +
			`GRANT ALL ON SCHEMA public TO public;` +
			`COMMENT ON SCHEMA public IS 'standard public schema';`,
	})
}

export const connectDatabase = (config: IDatabaseConfig) =>
	DatabaseClient(
		new Pool({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			database: config.database,
		}),
	)

export const connectAndSetupDatabase = async (config: IDatabaseConfig) => {
	const clientWithoutDatabase = DatabaseClient(
		new Pool({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			max: 1,
		}),
	)

	const postgresDatabaseResult = await clientWithoutDatabase.query<{}>(
		SQL.raw(`SELECT FROM pg_database WHERE datname = '${config.database}'`),
	)

	if (postgresDatabaseResult.length === 0) {
		await clientWithoutDatabase.query(Query(SQL.createDatabase(config.database)))
	}

	await clientWithoutDatabase.close()

	const database = DatabaseClient(
		new Pool({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			database: config.database,
		}),
	)

	if (config.clear === true) {
		console.info("[DATABASE] Clear database")
		await clearDatabase(database, config.user)
	}

	const schema = DatabaseSchema({
		client: database,
		views: [],
		name: "docs_proto",
		createStatements: composeCreateTableStatements(Tables),
		migrations,
	})

	await schema.init()
	await schema.migrateLatest()

	return { database, schema }
}
