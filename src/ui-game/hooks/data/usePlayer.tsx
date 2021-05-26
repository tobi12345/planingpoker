import { QueryConfig, useQuery } from "react-query"
import { Player, checkPlayer } from "../../../types-shared/game"
import { And, ConvertJson } from "../../../types-shared/typechecker"
import { DefaultError } from "../../../types-shared/types"

export const usePlayer = (gameID: string, config?: QueryConfig<Player, DefaultError>) => {
	return useQuery(
		["player", gameID],
		() => {
			const [error, player] = And(ConvertJson, checkPlayer)(localStorage.getItem(gameID) ?? "")
			return player
		},
		config,
	)
}
