import { IStuff } from ".."
import {
	checkCreateGamePayload,
	checkCreatePlayerPayload,
	checkPlayer,
	checkSetPlayerVotePayload,
	Game,
} from "../../types-shared/game"
import { isCheckError, Keys, TypeString } from "../../types-shared/typechecker"
import * as jwt from "jsonwebtoken"
import e from "express"
import { IConfig } from "../config"
import { HTTPStatusCodes } from "../../b-shared/HTTPStatusCodes"
import { UnauthorizedError, BaseRouter, CheckRequestConvert, ErrorHandlerChecked } from "../../b-shared/TypedExpress"
import { SendGameUpdate } from "../GameUpdateService"
import * as uuid from "uuid"

const checkPlayerAuthorization = (config: IConfig, req: e.Request, playerID: string) => {
	const token = (req.query.authToken as string | undefined) ?? req.headers.authorization

	if (!token) {
		throw new UnauthorizedError("authorization token missing")
	}

	try {
		const payload = jwt.verify(token, config.jwt.secret)

		const checkerResult = checkPlayer(payload)

		if (isCheckError(checkerResult)) {
			throw new UnauthorizedError("authorization token invalid")
		}

		if (checkerResult[1].id !== playerID) {
			throw new UnauthorizedError("authorization token invalid")
		}
	} catch (error) {
		throw new UnauthorizedError("authorization token invalid")
	}
}

export const GamesRouter = ({ games, gameUpdateService, config }: IStuff) => {
	const router = BaseRouter()

	const sendGameUpdate = SendGameUpdate(games, gameUpdateService)

	router.post(
		"/",
		CheckRequestConvert(
			Keys({
				body: checkCreateGamePayload,
			}),
			ErrorHandlerChecked(async (req, { body: { player, config: gameConfig } }, res) => {
				const playerID = uuid.v4()
				const game = await games.createGame(playerID, gameConfig)
				const creatorPlayer = await games.addPayerToGame(game.id, player, playerID)
				const token = jwt.sign(creatorPlayer, config.jwt.secret, {
					expiresIn: "365d",
				})
				const fullGame: Game = {
					...game,
					players: [creatorPlayer],
				}
				res.status(HTTPStatusCodes.CREATED).json({
					game: fullGame,
					player: creatorPlayer,
					token,
				})
			}),
		),
	)

	router.get(
		"/:gameID",
		CheckRequestConvert(
			Keys({
				params: Keys({
					gameID: TypeString,
				}),
			}),
			ErrorHandlerChecked(async (req, { params: { gameID } }, res) => {
				const game = await games.getFullGame(gameID)
				res.status(HTTPStatusCodes.OK).json(game)
			}),
		),
	)

	router.put(
		"/:gameID/reset",
		CheckRequestConvert(
			Keys({
				params: Keys({
					gameID: TypeString,
				}),
			}),
			ErrorHandlerChecked(async (req, { params: { gameID } }, res) => {
				await games.resetGame(gameID)
				await games.resetGamePlayer(gameID)
				await sendGameUpdate(gameID)
				res.status(HTTPStatusCodes.OK).end()
			}),
		),
	)

	router.put(
		"/:gameID/display",
		CheckRequestConvert(
			Keys({
				params: Keys({
					gameID: TypeString,
				}),
			}),
			ErrorHandlerChecked(async (req, { params: { gameID } }, res) => {
				await games.displayGameResult(gameID)
				await sendGameUpdate(gameID)
				res.status(HTTPStatusCodes.OK).end()
			}),
		),
	)

	router.post(
		"/:gameID/players",
		CheckRequestConvert(
			Keys({
				body: checkCreatePlayerPayload,
				params: Keys({
					gameID: TypeString,
				}),
			}),
			ErrorHandlerChecked(async (req, { body: createPlayerPayload, params: { gameID } }, res) => {
				await games.getGame(gameID)
				const player = await games.addPayerToGame(gameID, createPlayerPayload)
				const token = jwt.sign(player, config.jwt.secret, {
					expiresIn: "365d",
				})
				await sendGameUpdate(gameID)
				res.status(HTTPStatusCodes.OK).json({ token, player })
			}),
		),
	)

	router.post(
		"/:gameID/players/:playerID",
		CheckRequestConvert(
			Keys({
				params: Keys({
					gameID: TypeString,
					playerID: TypeString,
				}),
			}),
			ErrorHandlerChecked(async (req, { params: { gameID, playerID } }, res) => {
				console.log("remove ws over post")
				gameUpdateService.removePayerWebSocket(playerID)
				await sendGameUpdate(gameID)
				res.status(HTTPStatusCodes.OK).end()
			}),
		),
	)

	router.put(
		"/:gameID/players/:playerID",
		CheckRequestConvert(
			Keys({
				body: checkSetPlayerVotePayload,
				params: Keys({
					gameID: TypeString,
					playerID: TypeString,
				}),
			}),
			ErrorHandlerChecked(async (req, { body: { vote }, params: { gameID, playerID } }, res) => {
				checkPlayerAuthorization(config, req, playerID)
				await games.setPayerVoteForGame(playerID, vote)
				await sendGameUpdate(gameID)
				res.status(HTTPStatusCodes.OK).end()
			}),
		),
	)

	return router as any
}
