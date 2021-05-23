import React from "react"
import styled from "styled-components"
import { useSetPlayerVote } from "../hooks/data/useSetPlayerVote"
import { BaseCard } from "./BaseCard"

const CARD_SCRORES = [1, 2, 3, 5, 8, 13, 20, 40, 100]

const VotingCardsContainer = styled.div``

const Title = styled.div`
	text-align: center;
	margin-bottom: 20px;
	font-size: 18px;
`

const VotingCardsWrapper = styled.div`
	display: flex;
	justify-content: center;
`

const CardContainer = styled(BaseCard)`
	border: 2px solid #54a0ff;
	margin: 0 8px;
	color: #54a0ff;
	cursor: pointer;

	&:hover {
		background: #54a0ff4e;
	}
`

export const VotingCards = ({ gameID, playerID, myVote }: { gameID: string; playerID: string; myVote?: number }) => {
	const [setPlayerVote, {}] = useSetPlayerVote()

	return (
		<VotingCardsContainer>
			<Title>Choose your card 👇</Title>
			<VotingCardsWrapper>
				{CARD_SCRORES.map((score) => (
					<CardContainer
						style={{
							transform: myVote === score ? `translateY(-10px)` : undefined,
						}}
						key={score}
						onClick={() => setPlayerVote({ gameID, payload: { vote: score }, playerID })}
					>
						{score}
					</CardContainer>
				))}
			</VotingCardsWrapper>
		</VotingCardsContainer>
	)
}
