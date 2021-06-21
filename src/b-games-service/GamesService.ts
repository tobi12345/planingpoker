import redis from "redis"
import { Game } from "../types-shared/game"
import { IBaseConfig } from "../b-shared/BaseConfig"
import { CreateGame, DisplayGameResult, GetGame, GetGames, ResetGame } from "./Game"
import { AddPayerToGame, RemovePayerFromGame, SetPayerVoteForGame, GetGamePlayer, ResetGamePlayer } from "./Player"

export type GamesService = ReturnType<typeof GamesService>

export const GamesService = ({ redis: { host, port }, instanceID }: IBaseConfig) => {
	const client = redis.createClient({
		host,
		port,
		prefix: instanceID,
	})

	const createGame = CreateGame(client)
	const getGame = GetGame(client)
	const getGames = GetGames(client)
	const resetGame = ResetGame(client)
	const addPayerToGame = AddPayerToGame(client)
	const removePayerFromGame = RemovePayerFromGame(client)
	const setPayerVoteForGame = SetPayerVoteForGame(client)
	const getGamePlayer = GetGamePlayer(client)
	const displayGameResult = DisplayGameResult(client)
	const resetGamePlayer = ResetGamePlayer(client)

	const getFullGame = async (gameID: string): Promise<Game> => {
		const game = await getGame(gameID)
		const players = await getGamePlayer(gameID)

		return {
			...game,
			players,
		}
	}

	return {
		createGame,
		getGame,
		getGames,
		resetGame,
		addPayerToGame,
		removePayerFromGame,
		setPayerVoteForGame,
		getGamePlayer,
		getFullGame,
		displayGameResult,
		resetGamePlayer,
	}
}
