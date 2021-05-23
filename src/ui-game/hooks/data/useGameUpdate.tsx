import { useEffect, useState } from "react"
import { queryCache } from "react-query"
import { checkSocketEvent } from "../../../types-shared/SocketEvent"
import { And, ConvertJson, isCheckError } from "../../../types-shared/typechecker"

export const useGameUpdate = (gameID: string, playerID: string) => {
	const [connectionCount, setConnectionCount] = useState(0)

	useEffect(() => {
		const socket = connect(gameID, playerID)

		if (!socket) {
			return
		}

		const onVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				navigator.sendBeacon(`http://localhost:4001/games/${gameID}/players/${playerID}`)
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

const connect = (gameID: string, playerID: string) => {
	const socket = new WebSocket(`ws://localhost:4001?gameID=${gameID}&playerID=${playerID}`)

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
