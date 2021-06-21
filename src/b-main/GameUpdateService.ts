import { Game } from "../types-shared/game"
import { GameUpdate } from "../types-shared/SocketEvent"
import WebSocket from "ws"
import { GamesService } from "../b-games-service/GamesService"

export type GameUpdateService = ReturnType<typeof GameUpdateService>

export const GameUpdateService = () => {
	const playerSockets = new Map<string, WebSocket>()

	const addPayerWebSocket = (playerID: string, socket: WebSocket) => {
		playerSockets.set(playerID, socket)
	}

	const removePayerWebSocket = (playerID: string) => {
		const ws = playerSockets.get(playerID)
		if (ws) {
			ws.terminate()
			playerSockets.delete(playerID)
		}
	}

	const sendGameUpdate = (game: Game) => {
		const messageData: GameUpdate = {
			kind: "game.update",
			game,
		}
		const message = JSON.stringify(messageData)
		game.players.forEach(({ id }) => {
			const socket = playerSockets.get(id)
			if (!socket) {
				return
			}
			socket.send(message)
		})
	}

	return {
		addPayerWebSocket,
		removePayerWebSocket,
		sendGameUpdate,
	}
}

export const SendGameUpdate = (games: GamesService, gameUpdateService: GameUpdateService) => async (gameID: string) => {
	const game = await games.getFullGame(gameID)
	gameUpdateService.sendGameUpdate(game)
}
