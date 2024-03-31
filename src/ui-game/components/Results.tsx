import { Button, Modal, Typography } from "antd"
import { maxBy, minBy } from "lodash"
import React, { useMemo } from "react"
import styled from "styled-components"
import { Player, Game } from "../../types-shared/game"
import { useResetGame } from "../hooks/data/useResetGame"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { useNextConflictResolutionState } from "../hooks/data/useNextConflictResolutionState"

const ResultStatisticsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 20px;

	@media (max-width: 700px) {
		margin-top: 100px;
	}
`

const Result = styled.div`
	font-size: 18px;
	text-align: center;
	font-weight: bold;
`
const ResultNames = styled.div`
	font-size: 13px;
	font-weight: normal;
`

interface PlayerWithVote extends Player {
	vote: number
}

export const Results = ({ game, player }: { game: Game; player: Player }) => {
	const [resetGame, { isLoading: isLoadingResetGame }] = useResetGame()

	const { averageVote, maxPlayer, maxPlayers, minPlayer, minPlayers, isConflict } = useResults(game)
	const [nextConflictResolutionState] = useNextConflictResolutionState()

	return (
		<>
			<ResultStatisticsContainer>
				<Result>
					{`MIN: ${minPlayer?.vote ?? -1}`}
					<ResultNames>{minPlayers.join(", ")}</ResultNames>
				</Result>
				<Result>{`AVG: ${averageVote.toFixed(1)}`}</Result>
				<Result>
					{`MAX: ${maxPlayer?.vote ?? -1} `}
					<ResultNames>{maxPlayers.join(", ")}</ResultNames>
				</Result>
			</ResultStatisticsContainer>
			<div>
				<Button
					size="large"
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
				{isConflict && player.id === game.creator && (
					<Button
						style={{ marginLeft: 10 }}
						size="large"
						type="primary"
						loading={isLoadingResetGame}
						onClick={() => nextConflictResolutionState({ gameID: game.id })}
					>
						🤜🏻 🤛🏿
					</Button>
				)}
			</div>
			{game.conflictResolution && <FightModal game={game} />}
		</>
	)
}

export const useResults = (game: Game) => {
	return useMemo(() => {
		console.log(game)
		const playerWithVote = game.players.filter((player) => typeof player.vote === "number") as PlayerWithVote[]
		const averageVote = playerWithVote.reduce((acc, cur) => acc + (cur.vote ?? 0), 0) / playerWithVote.length
		const maxPlayer = maxBy(playerWithVote, (player) => player.vote)
		const maxPlayers = playerWithVote
			.filter((player) => player.vote === maxPlayer?.vote)
			.map((palyer) => palyer.name)
		const minPlayer = minBy(playerWithVote, (player) => player.vote)
		const minPlayers = playerWithVote
			.filter((player) => player.vote === minPlayer?.vote)
			.map((palyer) => palyer.name)

		const isConflict = minPlayer?.vote !== maxPlayer?.vote

		return {
			playerWithVote,
			averageVote,
			maxPlayer,
			maxPlayers,
			minPlayer,
			minPlayers,
			isConflict,
		}
	}, [game])
}

const FightModal = ({ game }: { game: Game }) => {
	const [nextConflictResolutionState] = useNextConflictResolutionState()
	const firstPlayer = game.players.find((player) => player.id === game.conflictResolution?.firstPlayer)!
	const secondPlayer = game.players.find((player) => player.id === game.conflictResolution?.secondPlayer)!

	return (
		<Modal title="Conflict Management" centered visible={true} footer={null} onOk={() => {}}>
			{game.conflictResolution?.state === "prepare_first" && (
				<ConflictPreRound
					onNext={() => nextConflictResolutionState({ gameID: game.id })}
					player={firstPlayer!}
				/>
			)}
			{game.conflictResolution?.state === "prepare_second" && (
				<ConflictPreRound
					onNext={() => nextConflictResolutionState({ gameID: game.id })}
					player={secondPlayer!}
				/>
			)}
			{game.conflictResolution?.state === "argument_first" && (
				<ConflictRound
					onDone={() => nextConflictResolutionState({ gameID: game.id })}
					player={firstPlayer}
					question={game.conflictResolution.firstQuestion}
				/>
			)}
			{game.conflictResolution?.state === "argument_second" && (
				<ConflictRound
					onDone={() => nextConflictResolutionState({ gameID: game.id })}
					player={secondPlayer}
					question={game.conflictResolution.secondQuestion}
				/>
			)}
		</Modal>
	)
}

const ConflictPreRound = ({ onNext, player }: { onNext: () => void; player: Player }) => {
	return (
		<div style={{ display: "grid", placeItems: "center" }}>
			<Typography.Title level={3}>{player.name} its your turn</Typography.Title>
			<Button type="primary" size="large" onClick={onNext}>
				Ready
			</Button>
		</div>
	)
}

const ConflictRoundContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-gap: 15px;
`

const ConflictRound = ({ onDone, player, question }: { onDone: () => void; player: Player; question: string }) => {
	return (
		<ConflictRoundContainer>
			<CountdownCircleTimer isPlaying={true} size={120} strokeWidth={6} colors={"#218380"} duration={30}>
				{({ elapsedTime }) => (
					<div style={{ display: "grid", placeItems: "center" }}>
						<div>{Math.floor(30 - (elapsedTime ?? 0))}</div>
						<div>Seconds</div>
						<Button type="text" size="small" onClick={onDone}>
							Done
						</Button>
					</div>
				)}
			</CountdownCircleTimer>

			<div>
				<Typography.Title level={3}>{player.name},</Typography.Title>
				<Typography.Title level={4}>{question}</Typography.Title>
			</div>
		</ConflictRoundContainer>
	)
}
