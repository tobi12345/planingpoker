import { IStuff } from ".."
import { HTTPStatusCodes } from "./HTTPStatusCodes"
import { CheckRequestConvert, ErrorHandlerChecked } from "./TypedExpress"
import { Keys } from "../../types-shared/typechecker"
import { AdministratorAuthRouter } from "./AdministratorAuth"

export const AdministratorRouter = ({ games, config }: IStuff) => {
	const router = AdministratorAuthRouter()

	router.get(
		"/games",
		CheckRequestConvert(
			Keys({}),
			ErrorHandlerChecked(async (req, _, res) => {
				const _games = games.getGames()
				res.status(HTTPStatusCodes.OK).json(_games)
			}),
		),
	)

	return router as any
}
