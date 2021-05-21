import React, { useContext } from "react"
import { configFromEnv } from "../ui-shared/configFromEnv"

interface IConfig {
	backendUrl: string
}

enum EnvVars {
	REACT_APP_BACKEND_URL = "REACT_APP_BACKEND_URL",
}

export const config = configFromEnv<IConfig>({
	make: (getValue) => ({
		backendUrl: getValue(EnvVars.REACT_APP_BACKEND_URL),
	}),
})

export const ConfigContext = React.createContext<IConfig>(config)

export const useConfig = () => useContext(ConfigContext)
