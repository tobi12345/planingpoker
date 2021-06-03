import { QueryConfig, useQuery } from "react-query"
import { Game } from "../../types-shared/game"
import { DefaultError } from "../../types-shared/types"
import { useServices } from "../services/Services"

export const useGames = (config?: QueryConfig<Game[], DefaultError>) => {
	const services = useServices()
	return useQuery(
		"games",
		async () => {
			const games = await services.admin.getGames()
			return games.map(([key, game]) => game)
		},
		config,
	)
}
