import { Button, Modal, Typography } from "antd"
import { maxBy, minBy, sample, shuffle } from "lodash"
import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components"
import { Player, Game } from "../../types-shared/game"
import { useResetGame } from "../hooks/data/useResetGame"
import { CountdownCircleTimer } from "react-countdown-circle-timer"

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
	const [showFightModal, setShowFightModal] = useState(false)

	const { averageVote, maxPlayer, maxPlayers, minPlayer, minPlayers, isConflict } = useResults(game)

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
						onClick={() => setShowFightModal(true)}
					>
						🤜🏻 🤛🏿
					</Button>
				)}
			</div>
			{showFightModal && <FightModal game={game} onClose={() => setShowFightModal(false)} />}
		</>
	)
}

export const useResults = (game: Game) => {
	return useMemo(() => {
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

const Questions = {
	WhyNot: (points?: number | string, points2?: number | string) => `why is it not a ${points2} for you?`,
	Why: (points?: number | string, points2?: number | string) => `why is it a ${points} for you?`,
	Different: (points?: number | string, points2?: number | string) =>
		`what makes it a ${points} not a ${points2} for you?`,
}

const randomQuestion = () => sample(Object.values(Questions))!

const FightModal = ({ game, onClose }: { game: Game; onClose: () => void }) => {
	const { maxPlayers, minPlayers } = useResults(game)

	const playerFromID = (name: string) => game.players.find((p) => p.name === name)
	const [[player1, player2]] = useState(
		shuffle([playerFromID(sample(maxPlayers)!), playerFromID(sample(minPlayers)!)]),
	)
	const question = useCallback(randomQuestion(), [])

	const [state, setState] = useState<"pre-round-one" | "round-one" | "pre-round-two" | "round-two">("pre-round-one")

	return (
		<Modal title="Conflict Management" centered visible={true} footer={null} onOk={() => {}} onCancel={onClose}>
			{state === "pre-round-one" && <ConflictPreRound onNext={() => setState("round-one")} player={player1!} />}
			{state === "pre-round-two" && <ConflictPreRound onNext={() => setState("round-two")} player={player2!} />}
			{state === "round-one" && (
				<ConflictRound
					onDone={() => setState("pre-round-two")}
					player={player1!}
					question={question(player1?.vote, player2?.vote)}
				/>
			)}
			{state === "round-two" && (
				<ConflictRound onDone={onClose} player={player2!} question={question(player2?.vote, player1?.vote)} />
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
			<CountdownCircleTimer
				isPlaying={true}
				size={120}
				strokeWidth={6}
				colors={"#218380"}
				duration={30}
				onComplete={(totalElapsedTime) => onDone()}
			>
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
