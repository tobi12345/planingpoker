import { MutationConfig, queryCache, useMutation } from "react-query"
import { CreateGamePayload, Game } from "../../../types-shared/game"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"

export const useCreateGame = (config?: MutationConfig<Game, DefaultError, CreateGamePayload>) => {
	const services = useServices()

	return useMutation((payload) => services.game.createGame(payload), {
		...config,
		onSuccess: (result, variables) => {
			queryCache.setQueryData(["game", result.id], () => result)
			if (config?.onSuccess) config.onSuccess(result, variables)
		},
	})
}
