import { MutationConfig, useMutation } from "react-query"
import { SetPlayerVotePayload, Player } from "../../../types-shared/game"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"

interface SetPlayerVoteVariables {
	payload: SetPlayerVotePayload
	gameID: string
	playerID: string
}

export const useSetPlayerVote = (config?: MutationConfig<void, DefaultError, SetPlayerVoteVariables>) => {
	const services = useServices()

	return useMutation(
		({ gameID, playerID, payload }) => services.game.setPlayerVote(gameID, playerID, payload),
		config,
	)
}
