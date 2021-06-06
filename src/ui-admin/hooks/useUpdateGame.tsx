import { AxiosError } from "axios"
import { MutationConfig, useMutation } from "react-query"
import { Game } from "../../types-shared/game"
import { DefaultError } from "../../types-shared/types"
import { useServices } from "../services/Services"

export const useUpdateGame = (opts?: MutationConfig<void, AxiosError<DefaultError>, Game>) => {
	const services = useServices()

	return useMutation((game: Game) => services.admin.updateGame(game), opts)
}
