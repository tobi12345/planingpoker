import React from "react"
import styled from "styled-components"
import { Game, Player } from "../../types-shared/game"
import { QuerySuspense } from "../common/QuerySuspense"
import { useGame } from "../hooks/data/useGame"
import { useGameUpdate } from "../hooks/data/useGameUpdate"

const GameContainer = styled.div``

export const GameView = ({ gameID, player }: { gameID: string; player: Player }) => {
	const query = useGame(gameID)
	useGameUpdate(gameID, player.id)

	return <QuerySuspense {...query}>{(game) => <Game game={game} />}</QuerySuspense>
}

const Game = ({ game }: { game: Game }) => {
	return (
		<GameContainer>
			<pre>{JSON.stringify(game, null, 4)}</pre>
		</GameContainer>
	)
}
