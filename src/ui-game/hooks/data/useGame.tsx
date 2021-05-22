import { useEffect } from "react"
import { queryCache, QueryConfig, useQuery } from "react-query"
import { Game } from "../../../types-shared/game"
import { And, ConvertJson, isCheckError } from "../../../types-shared/typechecker"
import { DefaultError } from "../../../types-shared/types"
import { checkSocketEvent } from "../../../types-shared/SocketEvent"
import { useServices } from "../../services/Services"
import { usePlayerAuthentication } from "../usePlayerAuthentication"

export const useGame = (id: string, config?: QueryConfig<Game, DefaultError>) => {
	const services = useServices()

	const { gameID, player } = usePlayerAuthentication()

	useEffect(() => {
		if (gameID && player?.id) {
			connect(gameID, player.id)
		}
	}, [gameID, player?.id])

	return useQuery(["game", id], () => services.game.getGame(id), config)
}

const connect = (gameID: string, playerID: string) => {
	const socket = new WebSocket(`ws://localhost:4001?gameID=${gameID}&playerID=${playerID}`)

	if (!socket) {
		console.log("error")
		return
	}

	socket.onopen = (event) => {
		console.log("connected")
	}

	socket.onclose = (event) => {
		console.log("disconnected")
	}

	socket.onmessage = (event) => {
		const claims = And(ConvertJson, checkSocketEvent)(event.data)

		if (isCheckError(claims)) {
			console.warn("unknown event data")
			return
		}

		const payload = claims[1]

		switch (payload.kind) {
			case "game.update":
				{
					queryCache.setQueryData(["game", payload.game.id], () => payload.game)
				}
				break
			default: {
				console.warn(`unhandled event kind ${payload.kind}`)
			}
		}

		console.log(event)
	}
}
