import React from "react"
import styled from "styled-components"
import { Game } from "../../types-shared/game"
import { useSetPlayerVote } from "../hooks/data/useSetPlayerVote"
import { BaseCard } from "./BaseCard"

const VotingCardsContainer = styled.div``

const Title = styled.div`
	text-align: center;
	margin-bottom: 20px;
	font-size: 18px;
`

const VotingCardsWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
`

const CardContainer = styled(BaseCard)`
	border: 2px solid #54a0ff;
	margin: 0 8px 20px 8px;
	color: #54a0ff;
	cursor: pointer;
	&:hover {
		background: #54a0ff4e;
	}
`

export const VotingCards = ({ game, playerID, myVote }: { game: Game; playerID: string; myVote?: number | string }) => {
	const [setPlayerVote, {}] = useSetPlayerVote()

	return (
		<VotingCardsContainer>
			<Title>Choose your card 👇</Title>
			<VotingCardsWrapper>
				{game.config.cards.map((score) => (
					<CardContainer
						style={{
							transform: String(myVote) === score ? `translateY(-10px)` : undefined,
						}}
						key={score}
						onClick={() => {
							const vote = score === myVote ? undefined : score
							setPlayerVote({ gameID: game.id, payload: { vote }, playerID })
						}}
					>
						{score}
					</CardContainer>
				))}
			</VotingCardsWrapper>
		</VotingCardsContainer>
	)
}
