import { AxiosInstance } from "axios"
import { CreateGamePayload, Game } from "../../types-shared/game"

export const GameService = (api: AxiosInstance) => {
	const createGame = async (payload: CreateGamePayload) => {
		const response = await api.post<Game>(`/games`, payload)

		return response.data
	}

	const getGame = async (id: string) => {
		const response = await api.get<Game>(`/games/${id}`)

		return response.data
	}

	return {
		createGame,
		getGame,
	}
}
