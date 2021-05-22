import { MutationConfig, queryCache, useMutation } from "react-query"
import { CreatePlayerPayload, Player } from "../../../types-shared/game"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"
import { GAME_ID_KEY, PLAYER_KEY } from "../usePlayerAuthentication"

interface CreatePlayerVariables {
	payload: CreatePlayerPayload
	gameID: string
}

export const useCreatePlayer = (config?: MutationConfig<Player, DefaultError, CreatePlayerVariables>) => {
	const services = useServices()

	return useMutation(({ gameID, payload }) => services.game.createPlayer(gameID, payload), {
		...config,
		onSuccess: (result, variables) => {
			queryCache.setQueryData("player", () => result)
			localStorage.setItem(PLAYER_KEY, JSON.stringify(result))
			localStorage.setItem(GAME_ID_KEY, variables.gameID)

			if (config?.onSuccess) config.onSuccess(result, variables)
		},
	})
}
