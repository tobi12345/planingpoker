import { Button } from "antd"
import React from "react"
import styled from "styled-components"
import { Game, Player } from "../../types-shared/game"
import { QuerySuspense } from "../common/QuerySuspense"
import { VotingCards } from "../components/VotingCards"
import { useGame } from "../hooks/data/useGame"
import { useGameUpdate } from "../hooks/data/useGameUpdate"
import { useResetGame } from "../hooks/data/useResetGame"
import { useShowResult } from "../hooks/data/useShowResult"

const GameContainer = styled.div``

export const GameView = ({ gameID, player }: { gameID: string; player: Player }) => {
	const query = useGame(gameID)
	useGameUpdate(gameID, player.id)

	return <QuerySuspense {...query}>{(game) => <Game game={game} player={player} />}</QuerySuspense>
}

const Game = ({ game, player }: { game: Game; player: Player }) => {
	const [resetGame, { isLoading: isLoadingResetGame }] = useResetGame()
	const [showResult, { isLoading: isLoadingShowResult }] = useShowResult()

	return (
		<GameContainer>
			<pre>{JSON.stringify(game, null, 4)}</pre>
			{game.visibilityState === "display" && (
				<Button
					type="primary"
					loading={isLoadingResetGame}
					onClick={() =>
						resetGame({
							gameID: game.id,
						})
					}
				>
					Reset
				</Button>
			)}
			{game.visibilityState === "hidden" && (
				<Button
					type="primary"
					loading={isLoadingShowResult}
					onClick={() =>
						showResult({
							gameID: game.id,
						})
					}
				>
					Show result
				</Button>
			)}
			<VotingCards gameID={game.id} playerID={player.id} />
		</GameContainer>
	)
}
