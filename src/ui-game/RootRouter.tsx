import React from "react"
import { Redirect, Route, RouteProps, Switch } from "react-router"
import { GameView } from "./views/GameView"
import { Start } from "./views/Start"

export const RootRouter = () => {
	return (
		<Switch>
			<Route path={"/"} exact render={() => <Start />} />
			<Route path={"/:id"} render={(props) => <GameView id={props.match.params.id} />} />
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
