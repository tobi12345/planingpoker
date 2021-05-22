import React from "react"
import { Redirect, Route, RouteProps, Switch } from "react-router"
import { usePlayerAuthentication } from "./hooks/usePlayerAuthentication"
import { GameView } from "./views/GameView"
import { JoinGameView } from "./views/JoinGameView"
import { Start } from "./views/Start"

export const RootRouter = () => {
	const { isAuthenticated } = usePlayerAuthentication()

	return (
		<Switch>
			<Route path={"/"} exact render={() => <Start />} />
			<Route
				path={"/:id"}
				exact
				render={(props) => {
					if (isAuthenticated) {
						return <GameView id={props.match.params.id} />
					}
					return <Redirect to={`/${props.match.params.id}/join`} />
				}}
			/>
			<Route
				path={"/:id/join"}
				render={(props) => {
					if (isAuthenticated) {
						return <Redirect to={`/${props.match.params.id}`} />
					}
					return <JoinGameView gameID={props.match.params.id} />
				}}
			/>
			<Route render={() => <Redirect to={`/`} />} />
		</Switch>
	)
}

interface IPrivateRouteProps extends Omit<RouteProps, "component"> {
	isAuthenticated: (() => boolean) | boolean
	fallbackUrl: string
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = ({ render, isAuthenticated, fallbackUrl, ...rest }) => {
	const isLoggedIn = typeof isAuthenticated === "function" ? isAuthenticated() : isAuthenticated

	return (
		<Route
			{...rest}
			render={(props) =>
				isLoggedIn && render ? (
					render(props)
				) : (
					<Redirect
						to={{ pathname: fallbackUrl, state: { from: props.location }, search: props.location.search }}
					/>
				)
			}
		/>
	)
}
