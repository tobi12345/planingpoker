import * as uuid from "uuid"
import * as faker from "faker"
import { Game, CreateGamePayload, Player, CreatePlayerPayload } from "../types-shared/game"
import { GameUpdate } from "../types-shared/SocketEvent"
import WebSocket from "ws"
import { NotFoundError } from "./rest/TypedExpress"

export type Games = ReturnType<typeof Games>

export const Games = () => {
	const games = new Map<string, Game>()
	const playerSockets = new Map<string, WebSocket>()

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

	const getGame = (gameID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}

		return game
	}

	const resetGame = (gameID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.payers.map((player) => ({ ...player, currentVote: undefined }))
		game.state = "hidden"
		sendGameUpdate(game)
		return game
	}

	const displayGameResult = (gameID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.state = "display"
		sendGameUpdate(game)
		return game
	}

	const addPayerToGame = (gameID: string, payload: CreatePlayerPayload) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}

		const player: Player = {
			id: uuid.v4(),
			...payload,
			isActive: false,
		}

		game.payers.push(player)
		sendGameUpdate(game)
		return player
	}

	const removePayerFromGame = (gameID: string, playerID: string) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.payers = game.payers.filter((player) => player.id === playerID)
		sendGameUpdate(game)
		return game
	}

	const setPayerVoteForGame = (gameID: string, playerID: string, vote: number) => {
		const game = games.get(gameID)
		if (!game) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.payers = game.payers.map((player) => (player.id === playerID ? { ...player, currentVote: vote } : player))
		sendGameUpdate(game)
	}

	const addPayerWebSocket = (gameID: string, playerID: string, socket: WebSocket) => {
		const game = games.get(gameID)
		if (!game || !game.payers.some((player) => player.id === playerID)) {
			throw new NotFoundError(`Game ${gameID} not found`)
		}
		game.payers = game.payers.map((player) => (player.id === playerID ? { ...player, isActive: true } : player))
		playerSockets.set(playerID, socket)
		sendGameUpdate(game)
		return true
	}

	const removePayerWebSocket = (gameID: string, playerID: string) => {
		const game = games.get(gameID)
		const ws = playerSockets.get(playerID)
		if (ws) {
			ws.terminate()
			playerSockets.delete(playerID)
		}

		if (game) {
			game.payers = game.payers.map((player) =>
				player.id === playerID ? { ...player, isActive: false } : player,
			)
			sendGameUpdate(game)
		}
	}

	const sendGameUpdate = (game: Game) => {
		const messageData: GameUpdate = {
			kind: "game.update",
			game,
		}
		const message = JSON.stringify(messageData)
		game.payers.forEach(({ id }) => {
			const socket = playerSockets.get(id)
			if (!socket) {
				return
			}
			socket.send(message)
		})
	}

	return {
		createGame,
		getGame,
		resetGame,
		displayGameResult,
		addPayerToGame,
		removePayerFromGame,
		setPayerVoteForGame,
		addPayerWebSocket,
		removePayerWebSocket,
	}
}
