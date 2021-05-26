import { Button } from "antd"
import { maxBy, minBy } from "lodash"
import React from "react"
import styled from "styled-components"
import { Player, Game } from "../../types-shared/game"
import { useResetGame } from "../hooks/data/useResetGame"

const ResultStatisticsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 20px;
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

export const Results = ({ game: { players, id } }: { game: Game }) => {
	const [resetGame, { isLoading: isLoadingResetGame }] = useResetGame()

	const playerWithVote = players.filter((player) => typeof player.vote === "number") as PlayerWithVote[]
	const averageVote = playerWithVote.reduce((acc, cur) => acc + (cur.vote ?? 0), 0) / playerWithVote.length
	const maxPlayer = maxBy(playerWithVote, (player) => player.vote)
	const maxPlayers = playerWithVote.filter((player) => player.vote === maxPlayer?.vote).map((palyer) => palyer.name)
	const minPlayer = minBy(playerWithVote, (player) => player.vote)
	const minPlayers = playerWithVote.filter((player) => player.vote === minPlayer?.vote).map((palyer) => palyer.name)

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
			<Button
				size="large"
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
