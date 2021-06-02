import { Table, TableRecord } from "postgres-schema-builder"
import { TablesV1 } from "./versions/TablesV1"

export const Tables = TablesV1

export interface IAdministratorDBResult extends TableRecord<typeof Tables.administrators> {}
export const AdministratorTable = Table(Tables, "administrators")
