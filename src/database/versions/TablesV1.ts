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
}
