import { ConvertJson, ConvertParseInt, Items, Keys, OneOf, TypeString } from "./typechecker"

export interface Player {
	id: string
	name: string
	currentVote?: number
}

export const checkPlayer = Keys<Player>({
	id: TypeString,
	name: TypeString,
})

export interface Game {
	id: string
	name: string
	state: "hidden" | "display"
	payers: Player[]
}

export const checkGame = Keys<Game>({
	id: TypeString,
	name: TypeString,
	state: OneOf("hidden", "display"),
	payers: Items(checkPlayer),
})

export interface CreateGamePayload {}

export const checkCreateGamePayload = Keys<CreateGamePayload>({})

export interface CreatePlayerPayload extends Pick<Player, "name"> {}

export const checkCreatePlayerPayload = Keys<CreatePlayerPayload>({
	name: TypeString,
})

export interface SetPlayerVotePayload {
	vote: number
}

export const checkSetPlayerVotePayload = Keys<SetPlayerVotePayload>({
	vote: ConvertParseInt,
})
