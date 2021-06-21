import WebSocket from "ws"
import * as http from "http"
import { IStuff } from ".."
import { isCheckError, Keys, TypeString } from "../../types-shared/typechecker"

const checkSocketConnectionSearchParams = Keys({
	gameID: TypeString,
	playerID: TypeString,
})

export const SocketServer = ({
	server,
	stuff: { games, gameUpdateService },
}: {
	server: http.Server
	stuff: IStuff
}) => {
	const socketServer = new WebSocket.Server({ server })

	socketServer.on("connection", function connection(ws, request) {
		const searchParams = new URLSearchParams(request.url?.replace(/\/|\?/g, ""))
		const object = Object.fromEntries(searchParams.entries())

		const claims = checkSocketConnectionSearchParams(object)

		if (isCheckError(claims)) {
			console.log(`onConnectionError: ${claims[0].join(`; `)}`)
			ws.close()
			return
		}

		const { gameID, playerID } = claims[1]

		try {
			gameUpdateService.addPayerWebSocket(playerID, ws)
		} catch (err) {
			console.error(`onConnectionError: addPayerWebSocket`)
			ws.close()
			return
		}

		ws.onclose = () => {
			console.log("by")
			gameUpdateService.removePayerWebSocket(playerID)
		}
	})
}
