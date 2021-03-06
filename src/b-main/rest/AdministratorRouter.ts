import { IStuff } from ".."
import { Keys, TypeString } from "../../types-shared/typechecker"
import { AdministratorAuthRouter } from "./AdministratorAuth"
import { checkGame } from "../../types-shared/game"
import { HTTPStatusCodes } from "../../b-shared/HTTPStatusCodes"
import { CheckRequestConvert, ErrorHandlerChecked } from "../../b-shared/TypedExpress"

export const AdministratorRouter = ({ games, config }: IStuff) => {
	const router = AdministratorAuthRouter()

	router.get(
		"/games",
		CheckRequestConvert(
			Keys({}),
			ErrorHandlerChecked(async (req, _, res) => {
				const _games = await games.getGames()
				res.status(HTTPStatusCodes.OK).json(_games)
			}),
		),
	)

	router.put(
		"/games/:gameID",
		CheckRequestConvert(
			Keys({
				params: Keys({
					gameID: TypeString,
				}),
				body: checkGame,
			}),
			ErrorHandlerChecked(async (req, { body: game }, res) => {
				// games.updateGame(game)
				res.status(HTTPStatusCodes.OK).end()
			}),
		),
	)

	return router as any
}
