import { IBaseConfig } from "../b-shared/BaseConfig"

export interface IConfig extends IBaseConfig {
	rest: {
		port: number
	}
	jwt: {
		secret: string
	}
}

const requiredEnvVars: string[] = []

export const configFromEnv = (): IConfig => {
	for (const requiredEnvVar of requiredEnvVars) {
		if (process.env[requiredEnvVar] === undefined) {
			throw new Error(`Required environment variable ${requiredEnvVar} is missing`)
		}
	}

	return {
		rest: {
			port: parseInt(process.env["PORT"] || "4001"),
		},
		jwt: {
			secret: process.env["JWT_SECRET"] || "",
		},
		instanceID: process.env["INSTANCE_ID"] || "main",
	}
}
