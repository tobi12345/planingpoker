import { MutationConfig, useMutation } from "react-query"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"

interface ResetGameVariables {
	gameID: string
}

export const useResetGame = (config?: MutationConfig<void, DefaultError, ResetGameVariables>) => {
	const services = useServices()

	return useMutation(({ gameID }) => services.game.resetGame(gameID), config)
}
