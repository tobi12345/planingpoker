import { checkGame, Game } from "./game"
import { Keys, OneOf, Or } from "./typechecker"

export interface GameUpdate {
	kind: "game.update"
	game: Game
}

const checkGameUpdate = Keys<GameUpdate>({
	game: checkGame,
	kind: OneOf("game.update"),
})

export type SocketEvent = GameUpdate

export const checkSocketEvent = Or(checkGameUpdate)
