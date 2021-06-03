import React from "react"
import { Redirect, Route, RouteProps } from "react-router"

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
