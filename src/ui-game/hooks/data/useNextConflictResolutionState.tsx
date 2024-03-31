import { MutationConfig, useMutation } from "react-query"
import { DefaultError } from "../../../types-shared/types"
import { useServices } from "../../services/Services"

interface NextConflictResolutionStateVariables {
	gameID: string
}

export const useNextConflictResolutionState = (
	config?: MutationConfig<void, DefaultError, NextConflictResolutionStateVariables>,
) => {
	const services = useServices()

	return useMutation(({ gameID }) => services.game.nextConflictResolutionState(gameID), config)
}
