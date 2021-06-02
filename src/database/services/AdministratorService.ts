import { IDatabaseClient } from "postgres-schema-builder"
import { IAdministratorDBResult, AdministratorTable } from "../../database/tables"
import { Administrator } from "../../types-shared/administrator"
import { v4 as uuid } from "uuid"

export class AdministratorNotFoundError extends Error {
	constructor(filterColumn: string, value: string) {
		super(`Administrator with ${filterColumn} ${value} not found`)
	}
}

const mapAdministrator = (dbResult: IAdministratorDBResult): Administrator => ({
	id: dbResult.administrator_id,
})

export type IAdministratorService = ReturnType<typeof AdministratorService>

interface IUserServiceArgs {
	database: IDatabaseClient
}

export const AdministratorService = ({ database }: IUserServiceArgs) => {
	const createDevAdministrator = async (email: string, password: string, id: string) => {
		await database.query(
			AdministratorTable.insert(["administrator_id", "email", "password", "date_added"])([
				id,
				email,
				password,
				new Date(),
			]),
		)

		return getAdministratorByID(id)
	}

	const createAdministrator = async (email: string, password: string) => {
		const id = uuid()

		await database.query(
			AdministratorTable.insert(["administrator_id", "email", "password", "date_added"])([
				id,
				email,
				password,
				new Date(),
			]),
		)

		return getAdministratorByID(id)
	}

	const getAdministratorByID = async (userID: string) => {
		const dbResults = await database.query(AdministratorTable.select("*", ["administrator_id"])([userID]))

		if (dbResults.length !== 1 || dbResults[0].date_removed !== null) {
			throw new AdministratorNotFoundError("administrator_id", userID)
		}

		return mapAdministrator(dbResults[0])
	}

	const getAdministratorByEmailPassword = async (email: string, password: string) => {
		const dbResults = await database.query(AdministratorTable.select("*", ["email", "password"])([email, password]))

		if (dbResults.length !== 1 || dbResults[0].date_removed !== null) {
			throw new AdministratorNotFoundError("email", email)
		}

		return mapAdministrator(dbResults[0])
	}

	const getAllAdministrator = async () => {
		const dbResults = await database.query(AdministratorTable.selectAll("*"))
		return dbResults.filter((dbResult) => dbResult.date_removed === null).map(mapAdministrator)
	}

	const deleteAdministrator = async (userID: string) => {
		await database.query(AdministratorTable.update(["date_removed"], ["administrator_id"])([new Date()], [userID]))
	}

	return {
		createDevAdministrator,
		createAdministrator,
		getAdministratorByID,
		getAdministratorByEmailPassword,
		getAllAdministrator,
		deleteAdministrator,
	}
}
