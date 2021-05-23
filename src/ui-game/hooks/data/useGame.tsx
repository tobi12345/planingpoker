import { QueryConfig, useQuery } from "react-query"
import { Game } from "../../../types-shared/game"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"

export const useGame = (gameID: string, config?: QueryConfig<Game, DefaultError>) => {
	const services = useServices()
	return useQuery(["game", gameID], () => services.game.getGame(gameID), config)
}
