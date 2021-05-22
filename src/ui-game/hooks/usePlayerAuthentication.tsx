import { checkPlayer } from "../../types-shared/game"
import { And, ConvertJson } from "../../types-shared/typechecker"

export const PLAYER_KEY = "PLAYER"
export const GAME_ID_KEY = "GAME_ID"

export const usePlayerAuthentication = () => {
	const [error, player] = And(ConvertJson, checkPlayer)(localStorage.getItem(PLAYER_KEY) ?? "")

	const gameID = localStorage.getItem(GAME_ID_KEY)

	return {
		player: player ?? null,
		gameID,
		isAuthenticated: !error && player && gameID,
	}
}
