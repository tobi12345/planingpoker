import { IBaseConfig } from "../b-shared/BaseConfig"

export interface IConfig extends IBaseConfig {
	rest: {
		port: number
		key: string
	}
	jwt: {
		secret: string
	}
	passwordSecret: string
}

const requiredEnvVars: string[] = []

export const configFromEnv = (): IConfig => {
	for (const requiredEnvVar of requiredEnvVars) {
		if (process.env[requiredEnvVar] === undefined) {
			throw new Error(`Required environment variable ${requiredEnvVar} is missing`)
		}
	}

	return {
		passwordSecret: process.env["PASSWORD_SECRET"] || "72865779884567890093833338832837151253192",
		rest: {
			port: parseInt(process.env["PORT"] || "4001"),
			key: process.env["REST_KEY"] || "4a76dbd4-688e-4921-90b8-2c2041d4b77c",
		},
		jwt: {
			secret: process.env["JWT_SECRET"] || "",
		},
		instanceID: process.env["INSTANCE_ID"] || "main",
	}
}

const getInteger = (value: any) => (!isNaN(value) ? parseInt(value) : undefined)
const getBoolean = (value: any) => Boolean(value)
