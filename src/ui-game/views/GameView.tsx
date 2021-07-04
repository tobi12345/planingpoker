import { Button } from "antd"
import React from "react"
import styled from "styled-components"
import { Game, Player } from "../../types-shared/game"
import { QuerySuspense } from "../../ui-shared/components/QuerySuspense"
import { PlayerCard } from "../components/PlayerCard"
import { VotingCards } from "../components/VotingCards"
import { useGame } from "../hooks/data/useGame"
import { useGameUpdate } from "../hooks/data/useGameUpdate"
import { useShowResult } from "../hooks/data/useShowResult"
import { Results, useResults } from "../components/Results"
import { ShareIcon } from "../components/ShareIcon"

const GameContainer = styled.div`
	height: 100%;
	display: grid;
	place-items: center;
	place-content: center;
`

const GameTable = styled.div`
	width: 400px;
	min-height: 230px;
	display: grid;
	place-items: center;
	background: #54a0ff4e;
	border-radius: 10px;
	margin-bottom: 20px;

	@media (max-width: 700px) {
		width: 100%;
		border-radius: 0px;
	}
`

const PlayersContainer = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin: 30px 0;
`

const StyledShareIcon = styled(ShareIcon)`
	position: fixed;
	top: 20px;
	right: 20px;
	width: 20px;
	height: 20px;
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
				{game.visibilityState === "display" && <Results game={game} player={player} />}
				{game.visibilityState === "hidden" && (
					<Button
						size="large"
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
			<StyledShareIcon />
			{/* <pre>{JSON.stringify(game, null, 4)}</pre> */}
		</GameContainer>
	)
}
