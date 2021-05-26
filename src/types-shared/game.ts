import { Items, Keys, OneOf, Or, TypeBoolean, TypeNumber, TypeString, TypeUndefined } from "./typechecker"

export interface Player {
	id: string
	name: string
	isActive: boolean
	vote?: number | string
}

export const checkPlayer = Keys<Player>({
	id: TypeString,
	name: TypeString,
	isActive: TypeBoolean,
	vote: Or(Or(TypeNumber, TypeUndefined), TypeString),
})

export type VisibilityState = "hidden" | "display"
const checkVisibilityState = OneOf("hidden", "display")
export interface Game {
	id: string
	name: string
	visibilityState: VisibilityState
	players: Player[]
}

export const checkGame = Keys<Game>({
	id: TypeString,
	name: TypeString,
	visibilityState: checkVisibilityState,
	players: Items(checkPlayer),
})

export interface CreateGamePayload {}

export const checkCreateGamePayload = Keys<CreateGamePayload>({})

export interface CreatePlayerPayload extends Pick<Player, "name"> {}

export const checkCreatePlayerPayload = Keys<CreatePlayerPayload>({
	name: TypeString,
})

export interface SetPlayerVotePayload {
	vote?: number | string
}

export const checkSetPlayerVotePayload = Keys<SetPlayerVotePayload>({
	vote: Or(Or(TypeNumber, TypeUndefined), TypeString),
})
