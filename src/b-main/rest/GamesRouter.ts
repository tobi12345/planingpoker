import { IStuff } from ".."
import { HTTPStatusCodes } from "./HTTPStatusCodes"
import { BaseRouter, CheckRequestConvert, ErrorHandlerChecked, UnauthorizedError } from "./TypedExpress"
import {
	checkCreateGamePayload,
	checkCreatePlayerPayload,
	checkPlayer,
	checkSetPlayerVotePayload,
} from "../../types-shared/game"
import { isCheckError, Keys, TypeString } from "../../types-shared/typechecker"
import * as jwt from "jsonwebtoken"
import e from "express"
import { IConfig } from "../config"

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

export const GamesRouter = ({ games, config }: IStuff) => {
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
		"/:gameID",
		CheckRequestConvert(
			Keys({
				params: Keys({
					gameID: TypeString,
				}),
			}),
			ErrorHandlerChecked(async (req, { params: { gameID } }, res) => {
				const game = games.getGame(gameID)

				if (!game) {
					res.status(HTTPStatusCodes.NOT_FOUND).json({ error: `Game with id: ${gameID} not found` })
					return
				}

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
				games.resetGame(gameID)
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
				games.displayGameResult(gameID)
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
				const player = games.addPayerToGame(gameID, createPlayerPayload)

				if (!player) {
					res.status(HTTPStatusCodes.NOT_FOUND).json({
						error: `Game with id: ${gameID} not found`,
					})
					return
				}

				const token = jwt.sign(player, config.jwt.secret, {
					expiresIn: "365d",
				})

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
				games.removePayerWebSocket(gameID, playerID)
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
				games.setPayerVoteForGame(gameID, playerID, vote)
				res.status(HTTPStatusCodes.OK).end()
			}),
		),
	)

	return router as any
}
