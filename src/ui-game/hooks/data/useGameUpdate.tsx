import { useEffect, useState } from "react"
import { queryCache } from "react-query"
import { checkSocketEvent } from "../../../types-shared/SocketEvent"
import { And, ConvertJson, isCheckError } from "../../../types-shared/typechecker"
import { useConfig, IConfig } from "../../Config"

export const useGameUpdate = (gameID: string, playerID: string) => {
	const [connectionCount, setConnectionCount] = useState(0)
	const config = useConfig()

	useEffect(() => {
		const socket = connect(gameID, playerID, config)

		if (!socket) {
			return
		}

		const onVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				navigator.sendBeacon(`${config.backendUrl}/games/${gameID}/players/${playerID}`)
			} else {
				setConnectionCount(connectionCount + 1)
			}
		}

		document.addEventListener("visibilitychange", onVisibilityChange)

		return () => {
			socket.close()
			document.removeEventListener("visibilitychange", onVisibilityChange)
		}
	}, [gameID, playerID, connectionCount])
}

const connect = (gameID: string, playerID: string, config: IConfig) => {
	const socket = new WebSocket(`${config.socketBackendUrl}?gameID=${gameID}&playerID=${playerID}`)
	if (!socket) {
		console.log("socket creation error")
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
	}

	return socket
}
