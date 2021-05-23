import { MutationConfig, queryCache, useMutation } from "react-query"
import { CreatePlayerPayload, Player } from "../../../types-shared/game"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"

export const PLAYER_KEY = "PLAYER"

interface CreatePlayerVariables {
	payload: CreatePlayerPayload
	gameID: string
}

export const useCreatePlayer = (config?: MutationConfig<Player, DefaultError, CreatePlayerVariables>) => {
	const services = useServices()

	return useMutation(({ gameID, payload }) => services.game.createPlayer(gameID, payload), {
		...config,
		onSuccess: (result, variables) => {
			queryCache.setQueryData(["player", variables.gameID], () => result)
			localStorage.setItem(`${PLAYER_KEY}_${variables.gameID}`, JSON.stringify(result))

			if (config?.onSuccess) config.onSuccess(result, variables)
		},
	})
}
