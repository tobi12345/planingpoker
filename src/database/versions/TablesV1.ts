import { ColumnType, NativeFunction, TableSchema } from "postgres-schema-builder"

export namespace TablesV1 {
	const baseSchema = TableSchema({
		date_added: {
			type: ColumnType.TimestampTZ,
			nullable: false,
			defaultValue: { func: NativeFunction.Now },
		},
		date_removed: { type: ColumnType.TimestampTZ, nullable: true },
	})

	export const administrators = TableSchema({
		administrator_id: {
			type: ColumnType.UUID,
			primaryKey: true,
			createIndex: true,
			nullable: false,
		},
		email: { type: ColumnType.Text, nullable: false },
		password: { type: ColumnType.Text, nullable: false },
		...baseSchema,
	})
}
