import { MutationConfig, queryCache, useMutation } from "react-query"
import { CreatePlayerPayload, Player } from "../../../types-shared/game"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"

export const PLAYER_TOKEN = "PLAYER_TOKEN"

interface CreatePlayerVariables {
	payload: CreatePlayerPayload
	gameID: string
}

export const useCreatePlayer = (
	config?: MutationConfig<{ player: Player; token: string }, DefaultError, CreatePlayerVariables>,
) => {
	const services = useServices()

	return useMutation(({ gameID, payload }) => services.game.createPlayer(gameID, payload), {
		...config,
		onSuccess: (result, variables) => {
			queryCache.setQueryData(["player", variables.gameID], () => result.player)
			localStorage.setItem(variables.gameID, JSON.stringify(result.player))
			localStorage.setItem(PLAYER_TOKEN, result.token)

			if (config?.onSuccess) config.onSuccess(result, variables)
		},
	})
}
