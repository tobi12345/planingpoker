import * as uuid from "uuid"
import * as faker from "faker"
import { Game, CreateGamePayload, Player } from "../types-shared/game"

export type Games = ReturnType<typeof Games>

export const Games = () => {
	const games = new Map<string, Game>()

	const createGame = (payload: CreateGamePayload) => {
		const game: Game = {
			id: uuid.v4(),
			name: faker.company.bs(),
			payers: [],
			state: "hidden",
		}

		games.set(game.id, game)

		return game
	}

	const getGame = (id: string) => {
		return games.get(id)
	}

	const resetGame = (id: string) => {
		const game = games.get(id)
		if (!game) {
			return undefined
		}
		game.payers.map((player) => ({ ...player, currentVote: undefined }))
		game.state = "hidden"
		return game
	}

	const displayGameResult = (id: string) => {
		const game = games.get(id)
		if (!game) {
			return undefined
		}
		game.state = "display"
		return game
	}

	const addPayerToGame = (id: string, payer: Player) => {
		const game = games.get(id)
		if (!game || game.payers.some((player) => player.id === id)) {
			return undefined
		}
		game.payers.push(payer)
		return game
	}

	const removePayerFromGame = (id: string, playerID: string) => {
		const game = games.get(id)
		if (!game) {
			return undefined
		}
		game.payers = game.payers.filter((player) => player.id === playerID)
		return game
	}

	const setPayerVoteGame = (id: string, playerID: string, vote: number) => {
		const game = games.get(id)
		if (!game) {
			return undefined
		}
		game.payers = game.payers.map((player) => (player.id === playerID ? { ...player, currentVote: vote } : player))

		return game
	}

	return {
		createGame,
		getGame,
		resetGame,
		displayGameResult,
		addPayerToGame,
		removePayerFromGame,
		setPayerVoteGame,
	}
}
