import { AxiosInstance } from "axios"
import { CreateGamePayload, Game, CreatePlayerPayload, Player, SetPlayerVotePayload } from "../../types-shared/game"

export interface CreateGameResult {
	game: Game
	player: Player
	token: string
}

export const GameService = (api: AxiosInstance) => {
	const createGame = async (payload: CreateGamePayload) => {
		const response = await api.post<CreateGameResult>(`/games`, payload)
		return response.data
	}

	const getGame = async (id: string) => {
		const response = await api.get<Game>(`/games/${id}`)
		return response.data
	}

	const createPlayer = async (gameID: string, payload: CreatePlayerPayload) => {
		const response = await api.post<{ player: Player; token: string }>(`/games/${gameID}/players`, payload)
		return response.data
	}

	const setPlayerVote = async (gameID: string, playerID: string, payload: SetPlayerVotePayload) => {
		const response = await api.put<void>(`/games/${gameID}/players/${playerID}`, payload)
		return response.data
	}

	const resetGame = async (gameID: string) => {
		const response = await api.put<void>(`/games/${gameID}/reset`)
		return response.data
	}

	const showResult = async (gameID: string) => {
		const response = await api.put<void>(`/games/${gameID}/display`)
		return response.data
	}

	return {
		createGame,
		getGame,
		createPlayer,
		setPlayerVote,
		resetGame,
		showResult,
	}
}
