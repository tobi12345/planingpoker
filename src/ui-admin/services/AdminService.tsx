import { AxiosInstance } from "axios"
import { Game } from "../../types-shared/game"

export const AdminService = (api: AxiosInstance) => {
	const getGames = async () => {
		const response = await api.get<[string, Game][]>(`/administrator/games`)
		return response.data
	}

	return {
		getGames,
	}
}
