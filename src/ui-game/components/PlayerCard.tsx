import React from "react"
import styled from "styled-components"
import { Player, VisibilityState } from "../../types-shared/game"
import { BaseCard } from "./BaseCard"

const PlayerCardContainer = styled.div`
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	margin: 0 15px;
`
const PlayerName = styled.div`
	font-weight: bold;
`
const PlayerCardHiddenBox = styled(BaseCard)`
	background: #576574;
`

const PlayerCardResultBox = styled(BaseCard)`
	border: 2px solid #54a0ff;
	color: #54a0ff;
`

export const PlayerCard = ({
	player: { name, vote },
	visibilityState,
}: {
	player: Player
	visibilityState: VisibilityState
}) => {
	return (
		<PlayerCardContainer>
			{visibilityState === "hidden" && <PlayerCardHiddenBox>{vote ? "👍" : ""}</PlayerCardHiddenBox>}
			{visibilityState === "display" && <PlayerCardResultBox>{vote ?? "🤦‍♀️"}</PlayerCardResultBox>}
			<PlayerName>{name}</PlayerName>
		</PlayerCardContainer>
	)
}
