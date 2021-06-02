import { IDatabaseClient } from "postgres-schema-builder"
import { AdministratorService } from "./AdministratorService"

export type IServices = ReturnType<typeof Services>

interface IServicesArgs {
	database: IDatabaseClient
}

export const Services = ({ database }: IServicesArgs) => {
	const administrator = AdministratorService({ database })

	return {
		administrator,
	}
}
