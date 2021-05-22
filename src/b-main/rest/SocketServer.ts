import WebSocket from "ws"
import * as http from "http"
import { IStuff } from ".."
import { isCheckError, Keys, TypeString } from "../../types-shared/typechecker"

const checkSocketConnectionSearchParams = Keys({
	gameID: TypeString,
	playerID: TypeString,
})

export const SocketServer = ({ server, stuff: { games } }: { server: http.Server; stuff: IStuff }) => {
	const socketServer = new WebSocket.Server({ server })

	socketServer.on("connection", function connection(ws, request) {
		const searchParams = new URLSearchParams(request.url?.replace(/\/|\?/g, ""))
		const object = Object.fromEntries(searchParams.entries())

		const claims = checkSocketConnectionSearchParams(object)

		if (isCheckError(claims)) {
			ws.close(-1)
			return
		}

		const { gameID, playerID } = claims[1]

		try {
			games.addPayerWebSocket(gameID, playerID, ws)
		} catch (err) {
			ws.close()
			return
		}

		ws.onclose = () => {
			games.removePayerWebSocket(playerID)
		}
	})
}
