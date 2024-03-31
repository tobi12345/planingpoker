import {
	ConvertParseFloat,
	Items,
	Keys,
	OneOf,
	Or,
	TypeBoolean,
	TypeNumber,
	TypeString,
	TypeUndefined,
} from "./typechecker"

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

export interface GameConfig {
	cards: string[]
}
export const checkGameConfig = Keys<GameConfig>({
	cards: Items(TypeString),
})

type ConflictResolutionState = "prepare_first" | "argument_first" | "prepare_second" | "argument_second"
const checkConflictResolutionState = OneOf("prepare_first", "argument_first", "prepare_second", "argument_second")

export interface ConflictResolution {
	state: ConflictResolutionState
	firstPlayer: string
	firstQuestion: string
	secondPlayer: string
	secondQuestion: string
}
export const checkConflictResolution = Keys<ConflictResolution>({
	state: checkConflictResolutionState,
	firstPlayer: TypeString,
	secondPlayer: TypeString,
	firstQuestion: TypeString,
	secondQuestion: TypeString,
})

export interface BaseGame {
	id: string
	name: string
	creator: string
	visibilityState: VisibilityState
	conflictResolution: undefined | ConflictResolution
	config: GameConfig
}
export interface Game extends BaseGame {
	players: Player[]
}

export const checkGame = Keys<Game>({
	id: TypeString,
	name: TypeString,
	visibilityState: checkVisibilityState,
	creator: TypeString,
	conflictResolution: Or(TypeUndefined, checkConflictResolution),
	players: Items(checkPlayer),
	config: checkGameConfig,
})

export interface CreatePlayerPayload extends Pick<Player, "name"> {}

export const checkCreatePlayerPayload = Keys<CreatePlayerPayload>({
	name: TypeString,
})

export interface CreateGamePayload {
	player: CreatePlayerPayload
	config: GameConfig
}

export const checkCreateGamePayload = Keys<CreateGamePayload>({
	player: checkCreatePlayerPayload,
	config: checkGameConfig,
})

export interface SetPlayerVotePayload {
	vote?: number | string
}

export const checkSetPlayerVotePayload = Keys<SetPlayerVotePayload>({
	vote: Or(Or(Or(TypeNumber, ConvertParseFloat), TypeUndefined), TypeString),
})
