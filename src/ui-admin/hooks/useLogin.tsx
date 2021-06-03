import { message } from "antd"
import { useCallback } from "react"
import { MutationConfig, useMutation } from "react-query"
import { useServices } from "../services/Services"
import { IGetAuthTokenPayload } from "../services/PublicService"
import { DefaultError } from "../../types-shared/types"
import { AxiosError } from "axios"

export const AUTH_TOKEN_KEY = "AUTH_TOKEN_KEY"

export const useLogin = (opts?: MutationConfig<string, AxiosError<DefaultError>, IGetAuthTokenPayload>) => {
	const services = useServices()

	return useMutation((payload: IGetAuthTokenPayload) => services._public.getAuthToken(payload), opts)
}

export const useLogout = () => {
	const logout = useCallback(() => {
		message.info("Token expired")
		localStorage.removeItem(AUTH_TOKEN_KEY)
		window.location.href = "/login"
	}, [])

	return logout
}
