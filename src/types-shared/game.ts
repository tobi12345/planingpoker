import { Keys } from "./typechecker"

export interface Game {
	id: string
	name: string
	state: "hidden" | "display"
	payers: Player[]
}

export interface CreateGamePayload {}

export const checkCreateGamePayload = Keys<CreateGamePayload>({})

export interface Player {
	id: string
	name: string
	currentVote?: number
}
