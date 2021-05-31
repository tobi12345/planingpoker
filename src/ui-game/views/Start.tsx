import { Button } from "antd"
import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { CardLogo } from "../components/CardLogo"
import { useCreateGame } from "../hooks/data/useCreateGame"

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
`

const ContentContainer = styled.div`
	display: grid;
	place-items: center;
	grid-template-columns: 1fr 1fr;
	width: 50%;
	margin-bottom: 100px;
`

const Bulletpoints = styled.div`
	font-size: 30px;
	margin: 10px 0;
`
const Bulletpoint = styled.div`
	margin: 10px 10px;
`

export const Start = () => {
	const history = useHistory()

	const [createGame, { isLoading }] = useCreateGame({
		onSuccess: (game) => {
			console.log(game)
			history.push(`/${game.id}`)
		},
	})

	return (
		<StartContainer>
			<Headline>simple planing poker</Headline>
			<ContentContainer>
				<CardLogo />
				<Bulletpoints>
					<Bulletpoint>1. create game</Bulletpoint>
					<Bulletpoint>2. share link</Bulletpoint>
					<Bulletpoint>3. play game</Bulletpoint>
				</Bulletpoints>
			</ContentContainer>
			<Button size="large" type="primary" loading={isLoading} onClick={() => createGame()}>
				Create new game
			</Button>
		</StartContainer>
	)
}
