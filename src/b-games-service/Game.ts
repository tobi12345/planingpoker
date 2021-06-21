import redis from "redis"
import * as uuid from "uuid"
import * as faker from "faker"
import { BaseGame, CreateGamePayload } from "../types-shared/game"
import { reject } from "lodash"
import { NotFoundError } from "../b-shared/TypedExpress"

const KEY_GAMES = "GAMES"

export const CreateGame = (client: redis.RedisClient) => (payload: CreateGamePayload) => {
	const game: BaseGame = {
		...payload,
		id: uuid.v4(),
		name: faker.company.bs(),
		visibilityState: "hidden",
	}

	return new Promise<BaseGame>((resolve, reject) => {
		client.hmset(game.id, ...Object.entries(game).flat(), (error) => {
			if (error) {
				return reject()
			}
			client.lpush(KEY_GAMES, game.id, (error) => {
				if (error) {
					return reject()
				}
				resolve(game)
			})
		})
	})
}

export const GetGame = (client: redis.RedisClient) => (gameID: string) => {
	return new Promise<BaseGame>((resolve, reject) => {
		client.hgetall(gameID, (error, game) => {
			if (error) {
				console.log(error)
				reject(new NotFoundError(`Game with id: ${gameID} not found`))
				return
			}
			resolve((game as any) as BaseGame)
		})
	})
}

export const GetGames = (client: redis.RedisClient) => () => {
	return new Promise<string[]>((resolve) => {
		client.lrange(KEY_GAMES, 0, -1, (error, games) => {
			if (error) {
				reject(error)
				return
			}
			resolve(games)
		})
	})
}

export const ResetGame = (client: redis.RedisClient) => async (gameID: string) => {
	// game.players = game.players.map((player) => ({ ...player, vote: undefined }))
	return new Promise<void>((resolve, reject) => {
		client.hset(gameID, "visibilityState", "hidden", (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

export const DisplayGameResult = (client: redis.RedisClient) => async (gameID: string) => {
	return new Promise<void>((resolve, reject) => {
		client.hset(gameID, "visibilityState", "display", (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}
