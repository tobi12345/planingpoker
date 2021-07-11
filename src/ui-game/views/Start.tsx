import { Button } from "antd"
import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { CardLogo } from "../../ui-shared/components/CardLogo"

const StartContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`
const Headline = styled.div`
	text-align: center;
	font-size: 70px;
	margin-bottom: 60px;

	@media (max-width: 700px) {
		font-size: 30px;
		margin-bottom: 100px;
	}
`

const ContentContainer = styled.div`
	display: grid;
	place-items: center;
	grid-template-columns: 1fr 1fr;
	width: 50%;
	margin-bottom: 100px;

	@media (max-width: 700px) {
		width: 80%;
	}
`

const Bulletpoints = styled.div`
	font-size: 30px;
	margin: 10px 0;

	@media (max-width: 700px) {
		font-size: 16px;
		margin: 5px 0;
	}
`
const Bulletpoint = styled.div`
	margin: 10px 10px;
`

const StyledCardLogo = styled(CardLogo)`
	@media (max-width: 700px) {
		width: 100px !important;
	}
`

export const Start = () => {
	const history = useHistory()

	return (
		<StartContainer>
			<Headline>simple planing poker</Headline>
			<ContentContainer>
				<StyledCardLogo />
				<Bulletpoints>
					<Bulletpoint>1. create game</Bulletpoint>
					<Bulletpoint>2. share link</Bulletpoint>
					<Bulletpoint>3. play game</Bulletpoint>
				</Bulletpoints>
			</ContentContainer>
			<Button size="large" type="primary" onClick={() => history.push(`/creategame`)}>
				Create new game
			</Button>
		</StartContainer>
	)
}
