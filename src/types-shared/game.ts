import { Items, Keys, OneOf, Or, TypeBoolean, TypeNumber, TypeString, TypeUndefined, TypeUnknown } from "./typechecker"

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

export interface BaseGame {
	id: string
	name: string
	creator: string
	visibilityState: VisibilityState
}
export interface Game extends BaseGame {
	players: Player[]
}

export const checkGame = Keys<Game>({
	id: TypeString,
	name: TypeString,
	visibilityState: checkVisibilityState,
	creator: TypeString,
	players: Items(checkPlayer),
})

export interface CreatePlayerPayload extends Pick<Player, "name"> {}

export const checkCreatePlayerPayload = Keys<CreatePlayerPayload>({
	name: TypeString,
})

export interface CreateGamePayload {
	player: CreatePlayerPayload
}

export const checkCreateGamePayload = Keys<CreateGamePayload>({
	player: checkCreatePlayerPayload,
})

export interface SetPlayerVotePayload {
	vote?: number | string
}

export const checkSetPlayerVotePayload = Keys<SetPlayerVotePayload>({
	vote: Or(Or(TypeNumber, TypeUndefined), TypeString),
})
