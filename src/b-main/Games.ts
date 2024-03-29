import * as uuid from "uuid"
import * as faker from "faker"
import { Game, Player, CreatePlayerPayload, GameConfig } from "../types-shared/game"
import { NotFoundError } from "../b-shared/TypedExpress"

export type Games = ReturnType<typeof Games>

export const Games = () => {
	const games = new Map<string, Game>()

	const createGame = (config: GameConfig, creator: string) => {
		const game: Game = {
			id: uuid.v4(),
			name: faker.company.bs(),
			players: [],
			creator,
			visibilityState: "hidden",
			config,
		}

		games.set(game.id, game)
		return game
	}

	const getGame = (gameID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}

		return game
	}

	const updateGame = (game: Game) => {
		const _game = games.get(game.id)
		if (!_game) {
			throw new NotFoundError(`Game ${game.id} not found`)
		}

		games.set(game.id, game)
		return game
	}

	const getGames = () => {
		return Array.from(games.entries())
	}

	const resetGame = (gameID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.players = game.players.map((player) => ({ ...player, vote: undefined }))
		game.visibilityState = "hidden"
		return game
	}

	const displayGameResult = (gameID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.visibilityState = "display"
		return game
	}

	const addPayerToGame = (gameID: string, payload: CreatePlayerPayload, id: string = uuid.v4()) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}

		const player: Player = {
			id: id,
			...payload,
			isActive: false,
		}

		game.players.push(player)
		return player
	}

	const removePayerFromGame = (gameID: string, playerID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.players = game.players.filter((player) => player.id === playerID)
		return game
	}

	const setPayerVoteForGame = (gameID: string, playerID: string, vote?: number | string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.players = game.players.map((player) => (player.id === playerID ? { ...player, vote } : player))
		return game
	}

	return {
		createGame,
		getGame,
		getGames,
		updateGame,
		resetGame,
		displayGameResult,
		addPayerToGame,
		removePayerFromGame,
		setPayerVoteForGame,
	}
}
