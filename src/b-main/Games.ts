import * as uuid from "uuid"
import * as faker from "faker"
import { Game, Player, CreatePlayerPayload, GameConfig } from "../types-shared/game"
import { NotFoundError } from "../b-shared/TypedExpress"
import { maxBy, minBy, sample } from "lodash"
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
			conflictResolution: undefined,
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
		game.conflictResolution = undefined
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

	const nextConflictResolutionState = (gameID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		if (game.conflictResolution === undefined) {
			if (game.visibilityState === "hidden") {
				throw new NotFoundError(`Game ${gameID} is in hidden state`)
			}
			const question = sample({
				WhyNot: (points?: number | string, points2?: number | string) => `why is it not a ${points2} for you?`,
				Why: (points?: number | string, points2?: number | string) => `why is it a ${points} for you?`,
				Different: (points?: number | string, points2?: number | string) =>
					`what makes it a ${points} not a ${points2} for you?`,
			})!

			const firstPlayer = maxBy(game.players, (player) => player.vote)!
			const secondPlayer = minBy(game.players, (player) => player.vote)!

			game.conflictResolution = {
				state: "prepare_first",
				firstPlayer: firstPlayer.id,
				secondPlayer: secondPlayer.id,
				firstQuestion: question(firstPlayer.vote, secondPlayer.vote),
				secondQuestion: question(secondPlayer.vote, firstPlayer.vote),
			}
			return game
		}

		switch (game.conflictResolution.state) {
			case "prepare_first": {
				game.conflictResolution.state = "argument_first"
				return game
			}
			case "argument_first": {
				game.conflictResolution.state = "prepare_second"
				return game
			}
			case "prepare_second": {
				game.conflictResolution.state = "argument_second"
				return game
			}
			case "argument_second": {
				game.conflictResolution = undefined
				return game
			}
		}
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
		nextConflictResolutionState,
	}
}
