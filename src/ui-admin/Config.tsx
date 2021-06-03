import React, { useContext } from "react"
import { configFromEnv } from "../ui-shared/configFromEnv"

export interface IConfig {
	backendUrl: string
	socketBackendUrl: string
}

enum EnvVars {
	REACT_APP_BACKEND_BASE_URL = "REACT_APP_BACKEND_BASE_URL",
	REACT_APP_USE_SSL = "REACT_APP_USE_SSL",
}

export const config = configFromEnv<IConfig>({
	make: (getValue) => {
		const backendUrl = getValue(EnvVars.REACT_APP_BACKEND_BASE_URL)
		const useSSL = getValue(EnvVars.REACT_APP_USE_SSL) === "true"

		return {
			backendUrl: `http${useSSL ? "s" : ""}://${backendUrl}`,
			socketBackendUrl: `ws${useSSL ? "s" : ""}://${backendUrl}`,
		}
	},
})

export const ConfigContext = React.createContext<IConfig>(config)

export const useConfig = () => useContext(ConfigContext)
