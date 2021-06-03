import React, { useMemo } from "react"
import axios, { AxiosError } from "axios"
import { useConfig } from "./Config"
import { Services, ServicesContext } from "./services/Services"
import { ReactQueryConfigProvider, ReactQueryConfig } from "react-query"
import { RootRouter } from "./RootRouter"
import { BrowserRouter } from "react-router-dom"
import { AUTH_TOKEN_KEY, useLogout } from "./hooks/useLogin"

const reactQueryConfig: ReactQueryConfig = {
	queries: {
		refetchOnWindowFocus: false,
	},
}

export const App = () => {
	const config = useConfig()

	const logout = useLogout()

	const api = useMemo(() => {
		const client = axios.create({
			baseURL: config.backendUrl,
		})

		client.interceptors.request.use(function (config) {
			config.headers.Authorization = localStorage.getItem(AUTH_TOKEN_KEY)
			return config
		})

		client.interceptors.response.use(
			(response) => response,
			(error: AxiosError) => {
				if (error.response?.status === 401) {
					logout()
					return
				}

				return Promise.reject(error)
			},
		)

		return client
	}, [config, logout])

	const services = useMemo(() => Services(api), [api])

	return (
		<ServicesContext.Provider value={services}>
			<ReactQueryConfigProvider config={reactQueryConfig}>
				<BrowserRouter>
					<RootRouter />
				</BrowserRouter>
			</ReactQueryConfigProvider>
		</ServicesContext.Provider>
	)
}
