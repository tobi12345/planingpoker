import { MutationConfig, queryCache, useMutation } from "react-query"
import { CreateGamePayload, Game } from "../../../types-shared/game"
import { DefaultError } from "../../../types-shared/types"
import { CreateGameResult } from "../../services/GameService"
import { useServices } from "../../services/Services"
import { setPlayer } from "./useCreatePlayer"

export const useCreateGame = (config?: MutationConfig<CreateGameResult, DefaultError, CreateGamePayload>) => {
	const services = useServices()

	return useMutation((payload) => services.game.createGame(payload), {
		...config,
		onSuccess: (result, variables) => {
			queryCache.setQueryData(["game", result.game.id], () => result.game)
			setPlayer(result.game.id, result.token, result.player)
			if (config?.onSuccess) config.onSuccess(result, variables)
		},
	})
}
