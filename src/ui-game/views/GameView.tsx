import React from "react"
import styled from "styled-components"
import { Game } from "../../types-shared/game"
import { QuerySuspense } from "../common/QuerySuspense"
import { useGame } from "../hooks/data/useGame"

const GameContainer = styled.div``

export const GameView = ({ id }: { id: string }) => {
	const query = useGame(id)

	return <QuerySuspense {...query}>{(game) => <Game game={game} />}</QuerySuspense>
}

const Game = ({ game }: { game: Game }) => {
	return (
		<GameContainer>
			<pre>{JSON.stringify(game, null, 4)}</pre>
		</GameContainer>
	)
}
