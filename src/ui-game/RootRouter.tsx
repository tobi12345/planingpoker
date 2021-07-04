import React from "react"
import { Redirect, Route, RouteComponentProps, RouteProps, StaticContext, Switch } from "react-router"
import { usePlayer } from "./hooks/data/usePlayer"
import { CreateGameView } from "./views/CreateGameView"
import { GameView } from "./views/GameView"
import { JoinGameView } from "./views/JoinGameView"
import { Start } from "./views/Start"

export const RootRouter = () => {
	return (
		<Switch>
			<Route path={"/"} exact render={() => <Start />} />
			<Route path={"/creategame"} exact render={() => <CreateGameView />} />
			<Route path={"/:gameID"} render={(props) => <Game {...props} />} />
			<Route render={() => <Redirect to={`/`} />} />
		</Switch>
	)
}

const Game = (props: RouteComponentProps<any, StaticContext, unknown>) => {
	const gameID = props.match.params.gameID
	const { data: player } = usePlayer(gameID)

	if (player) {
		return <GameView gameID={gameID} player={player} />
	}

	return <JoinGameView gameID={gameID} />
}
