import { IStuff } from ".."
import { HTTPStatusCodes } from "./HTTPStatusCodes"
import { BaseRouter, CheckRequestConvert, ErrorHandlerChecked } from "./TypedExpress"
import { checkCreateGamePayload } from "../../types-shared/game"
import { Keys, TypeString } from "../../types-shared/typechecker"

export const GamesRouter = ({ games }: IStuff) => {
	const router = BaseRouter()

	router.post(
		"/",
		CheckRequestConvert(
			checkCreateGamePayload,
			ErrorHandlerChecked(async (req, payload, res) => {
				res.status(HTTPStatusCodes.CREATED).json(games.createGame(payload))
			}),
		),
	)

	router.get(
		"/:id",
		CheckRequestConvert(
			Keys({
				params: Keys({
					id: TypeString,
				}),
			}),
			ErrorHandlerChecked(async (req, { params: { id } }, res) => {
				const game = games.getGame(id)

				if (!game) {
					res.status(HTTPStatusCodes.NOT_FOUND).json({ error: `Game with id: ${id} not found` })
					return
				}

				res.status(HTTPStatusCodes.OK).json(game)
			}),
		),
	)

	return router as any
}
