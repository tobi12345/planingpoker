import React from "react"
import { Redirect, Route, Switch } from "react-router"
import { PrivateRoute } from "../ui-shared/components/PrivateRoute"
import { AUTH_TOKEN_KEY } from "./hooks/useLogin"
import { Dashboard } from "./views/Dashboard"
import { Login } from "./views/Login"

export const RootRouter = () => {
	return (
		<Switch>
			<Route path={"/login"} render={() => <Login />} />
			<PrivateRoute
				isAuthenticated={() => !!localStorage.getItem(AUTH_TOKEN_KEY)}
				fallbackUrl={"/login"}
				path={"/"}
				render={() => <Dashboard />}
			/>
			<Route render={() => <Redirect to={`/`} />} />
		</Switch>
	)
}
