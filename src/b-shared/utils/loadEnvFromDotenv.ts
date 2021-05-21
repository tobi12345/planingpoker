import * as dotenv from "dotenv"
import * as fs from "fs"
import * as path from "path"

export const loadEnvFromDotenv = (environment: string) => {
	const filePath = path.join(process.cwd(), `${environment}.env`)

	if (fs.existsSync(filePath)) {
		dotenv.config({
			path: filePath,
		})
	} else {
		console.info(`Dotenv ${path} not found, taking environment variables which are passed to this node process`)
	}
}
