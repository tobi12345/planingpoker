import { Button } from "antd"
import React from "react"
import styled from "styled-components"
import { useSetPlayerVote } from "../hooks/data/useSetPlayerVote"

const CARD_SCRORES = [1, 2, 3, 5, 8, 13, 20, 40, 100]

const VotingCardsContainer = styled.div``

const CardContainer = styled.div``

const StyledButton = styled(Button)`
	width: 80px;
`

export const VotingCards = ({ gameID, playerID }: { gameID: string; playerID: string }) => {
	const [setPlayerVote, {}] = useSetPlayerVote()

	return (
		<VotingCardsContainer>
			{CARD_SCRORES.map((score) => (
				<CardContainer key={score}>
					<StyledButton
						onClick={() => setPlayerVote({ gameID, payload: { vote: score }, playerID })}
						type={"primary"}
					>
						{score}
					</StyledButton>
				</CardContainer>
			))}
		</VotingCardsContainer>
	)
}
