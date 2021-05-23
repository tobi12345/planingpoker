import { Button } from "antd"
import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { useCreateGame } from "../hooks/data/useCreateGame"

const StartContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
			<Button type="primary" loading={isLoading} onClick={() => createGame()}>
				Create new game
			</Button>
		</StartContainer>
	)
}
