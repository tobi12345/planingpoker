import { Button, Statistic } from "antd"
import React from "react"
import styled from "styled-components"
import { Game, Player } from "../../types-shared/game"
import { QuerySuspense } from "../common/QuerySuspense"
import { PlayerCard } from "../components/PlayerCard"
import { VotingCards } from "../components/VotingCards"
import { useGame } from "../hooks/data/useGame"
import { useGameUpdate } from "../hooks/data/useGameUpdate"
import { useResetGame } from "../hooks/data/useResetGame"
import { useShowResult } from "../hooks/data/useShowResult"
import { maxBy, minBy } from "lodash"

const GameContainer = styled.div`
	height: 100%;
	display: grid;
	place-items: center;
	place-content: center;
`

const GameTable = styled.div`
	width: 350px;
	height: 180px;
	display: grid;
	place-items: center;
	background: #54a0ff4e;
	border-radius: 10px;
	margin-bottom: 20px;
`

const PlayersContainer = styled.div`
	display: flex;
	margin: 30px 0;
`

export const GameView = ({ gameID, player }: { gameID: string; player: Player }) => {
	const query = useGame(gameID)
	useGameUpdate(gameID, player.id)

	return <QuerySuspense {...query}>{(game) => <Game game={game} player={player} />}</QuerySuspense>
}

const Game = ({ game, player }: { game: Game; player: Player }) => {
	const [showResult, { isLoading: isLoadingShowResult }] = useShowResult()

	const myVote = game.players.find((_player) => _player.id === player.id)?.vote

	return (
		<GameContainer>
			<GameTable>
				{game.visibilityState === "display" && <ResultBox game={game} />}
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
			</GameTable>
			<PlayersContainer>
				{game.players.map((player) => (
					<PlayerCard key={player.id} player={player} visibilityState={game.visibilityState} />
				))}
			</PlayersContainer>
			<VotingCards gameID={game.id} playerID={player.id} myVote={myVote} />
			<div style={{ height: "30px" }}></div>
			{/* <pre>{JSON.stringify(game, null, 4)}</pre> */}
		</GameContainer>
	)
}

const ResultStatisticsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 20px;
	place-items: center;
`

const ResultBox = ({ game: { players, id } }: { game: Game }) => {
	const [resetGame, { isLoading: isLoadingResetGame }] = useResetGame()

	const playerWithVote = players.filter((player) => !!player.vote)
	const averageVote = playerWithVote.reduce((acc, cur) => acc + (cur.vote ?? 0), 0) / playerWithVote.length
	const maxPlayer = maxBy(players, (player) => player.vote)
	const minPlayer = minBy(players, (player) => player.vote)

	return (
		<>
			<ResultStatisticsContainer>
				<Statistic title="AVG" value={averageVote} />
				<Statistic title={`MAX (${maxPlayer?.name ?? "-"})`} value={maxPlayer?.vote ?? -1} />
				<Statistic title={`MIN (${minPlayer?.name ?? "-"})`} value={minPlayer?.vote ?? -1} />
			</ResultStatisticsContainer>
			<Button
				type="primary"
				loading={isLoadingResetGame}
				onClick={() =>
					resetGame({
						gameID: id,
					})
				}
			>
				Reset
			</Button>
		</>
	)
}
