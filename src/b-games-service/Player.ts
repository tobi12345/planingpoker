import redis from "redis"
import * as uuid from "uuid"
import { CreatePlayerPayload, Player } from "../types-shared/game"

const KEY_GAME_PLAYERS = (gameID: string) => `PLAYERS-${gameID}`

type RedisPlayerResult = {
	[key in keyof Player]: string
}

const parsePlayerVote = (value: string | undefined) => {
	if (value === "undefined") {
		return undefined
	}

	const res = parseFloat(value ?? "")

	return isNaN(res) ? value : res
}

const mapPlayer = (rawPlayer: RedisPlayerResult): Player => ({
	...rawPlayer,
	isActive: rawPlayer.isActive === "true",
	vote: parsePlayerVote(rawPlayer.vote),
})

export const AddPayerToGame = (client: redis.RedisClient) => (
	gameID: string,
	payload: CreatePlayerPayload,
	id?: string,
) => {
	const player: Player = {
		id: id ?? uuid.v4(),
		...payload,
		isActive: false,
	}

	return new Promise<Player>((resolve, reject) => {
		client.hmset(player.id, ...Object.entries(player).flat(), (error) => {
			if (error) {
				console.log(error)
				reject()
				return
			}
			client.sadd(KEY_GAME_PLAYERS(gameID), player.id, (error) => {
				if (error) {
					console.log(error)
					reject()
					return
				}
				resolve(player)
			})
		})
	})
}

export const GetGamePlayer = (client: redis.RedisClient) => (gameID: string) => {
	return new Promise<Player[]>(async (resolve, reject) => {
		client.smembers(KEY_GAME_PLAYERS(gameID), async (error, playerIDs) => {
			if (error) {
				console.log(error)
				reject()
				return
			}

			const players = await Promise.all(
				playerIDs.map(
					(player) =>
						new Promise<Player>((resolve) => {
							client.HGETALL(player, (error, result) => {
								if (error) {
									console.log(error)
								}
								resolve(mapPlayer((result as any) as RedisPlayerResult))
							})
						}),
				),
			)

			resolve(players ?? [])
		})
	})
}

export const RemovePayerFromGame = (client: redis.RedisClient) => (gameID: string, playerID: string) => {
	return new Promise<void>((resolve, reject) => {
		client.del(playerID, () => {
			client.srem(KEY_GAME_PLAYERS(gameID), playerID, (error) => {
				if (error) {
					console.log(error)
					reject(error)
					return
				}
				resolve()
			})
		})
	})
}

export const SetPayerVoteForGame = (client: redis.RedisClient) => (playerID: string, vote?: number | string) => {
	return new Promise<void>((resolve, reject) => {
		client.hset(playerID, "vote", String(vote), (error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

export const ResetGamePlayer = (client: redis.RedisClient) => (gameID: string) => {
	return new Promise<void>(async (resolve, reject) => {
		client.smembers(KEY_GAME_PLAYERS(gameID), async (error, playerIDs) => {
			if (error) {
				console.log(error)
				reject()
				return
			}

			await Promise.all(
				playerIDs.map(
					(player) =>
						new Promise<void>((resolve) => {
							client.HSET(player, "vote", "undefined", (error, result) => {
								if (error) {
									console.log(error)
								}
								resolve()
							})
						}),
				),
			)
			resolve()
		})
	})
}
