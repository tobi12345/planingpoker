import { useEffect } from "react"
import { QueryConfig, useQuery } from "react-query"
import { Game } from "../../../types-shared/game"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"

export const useGame = (id: string, config?: QueryConfig<Game, DefaultError>) => {
	const services = useServices()

	useEffect(() => {
		connect()
	}, [])

	return useQuery(["game", id], () => services.game.getGame(id), config)
}

const connect = () => {
	const socket = new WebSocket("ws://localhost:4001")

	if (!socket) {
		console.log("error")
		return
	}

	socket.onopen = (event) => {
		console.log("connected")
	}

	socket.onmessage = (event) => {
		console.log(console.log(event))
	}
}
