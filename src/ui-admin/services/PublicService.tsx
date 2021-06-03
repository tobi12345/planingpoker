import { AxiosInstance } from "axios"
export type IPublicService = ReturnType<typeof PublicService>

export interface IGetAuthTokenPayload {
	email: string
	password: string
}

export const PublicService = (api: AxiosInstance) => {
	const getAuthToken = async (payload: IGetAuthTokenPayload) => {
		const response = await api.post<{ token: string }>(`/public/login`, payload)
		return response.data.token
	}

	return {
		getAuthToken,
	}
}
