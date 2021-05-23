import { Items, Keys, OneOf, Or, TypeBoolean, TypeNumber, TypeString, TypeUndefined } from "./typechecker"

export interface Player {
	id: string
	name: string
	isActive: boolean
	vote?: number
}

export const checkPlayer = Keys<Player>({
	id: TypeString,
	name: TypeString,
	isActive: TypeBoolean,
	vote: Or(TypeUndefined, TypeNumber),
})

export type VisibilityState = "hidden" | "display"
const checkVisibilityState = OneOf("hidden", "display")
export interface Game {
	id: string
	name: string
	visibilityState: VisibilityState
	payers: Player[]
}

export const checkGame = Keys<Game>({
	id: TypeString,
	name: TypeString,
	visibilityState: checkVisibilityState,
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
	vote: TypeNumber,
})
