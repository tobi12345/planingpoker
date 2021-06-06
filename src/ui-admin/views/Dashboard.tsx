import React, { useState } from "react"
import styled from "styled-components"
import { checkGame, Game } from "../../types-shared/game"
import { QuerySuspense } from "../../ui-shared/components/QuerySuspense"
import { useGames } from "../hooks/useGames"
import AceEditor from "react-ace"
import { Button } from "antd"
import "ace-builds/src-noconflict/mode-json"
import "ace-builds/src-noconflict/theme-github"
import { useUpdateGame } from "../hooks/useUpdateGame"
import { isCheckValid } from "../../types-shared/typechecker"

const DashboardContainer = styled.div``

export const Dashboard = () => {
	const gamesQuery = useGames()

	return (
		<DashboardContainer>
			<QuerySuspense {...gamesQuery}>{(games) => <Games games={games} />}</QuerySuspense>
		</DashboardContainer>
	)
}

const GamesContainer = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
	grid-gap: 20px;
	padding: 20px;
`

const GamesListContainer = styled.div``

const GamesContentContainer = styled.div``

const Games = ({ games }: { games: Game[] }) => {
	const [selectedGame, setSelectedGame] = useState<string | undefined>()
	const [updateGame, { isLoading }] = useUpdateGame()

	return (
		<GamesContainer>
			<GamesListContainer>
				{games.map((game) => (
					<div key={game.id} onClick={() => setSelectedGame(JSON.stringify(game, null, 4))}>
						{game.id}
					</div>
				))}
			</GamesListContainer>
			{selectedGame && (
				<GamesContentContainer>
					<Button
						loading={isLoading}
						type="primary"
						onClick={() => {
							const game = checkGame(JSON.parse(selectedGame))
							if (isCheckValid(game)) {
								updateGame(game[1])
							}
						}}
					>
						Save
					</Button>
					<AceEditor
						value={selectedGame}
						mode="java"
						theme="github"
						onChange={(value) => setSelectedGame(value)}
						name="UNIQUE_ID_OF_DIV"
						editorProps={{ $blockScrolling: true }}
					/>
				</GamesContentContainer>
			)}
		</GamesContainer>
	)
}
