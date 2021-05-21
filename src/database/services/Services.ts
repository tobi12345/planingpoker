import { IDatabaseClient } from "postgres-schema-builder"

export type IServices = ReturnType<typeof Services>

interface IServicesArgs {
	database: IDatabaseClient
}

export const Services = ({ database }: IServicesArgs) => {
	return {}
}
