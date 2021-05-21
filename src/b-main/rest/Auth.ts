import * as Express from "express"
import { IStuff } from ".."

export const Auth = (stuff: IStuff) => async (
	req: Express.Request,
	res: Express.Response,
	next: Express.NextFunction,
) => {
	const { services, config } = stuff

	const token = (req.query.authToken as string | undefined) ?? req.headers.authorization

	if (!token) {
		return res.status(401).send({ error: "authorization token missing" })
	}

	if (token === config.rest.key) {
		return next()
	}

	return res.status(401).send({ error: "authorization token invalid" })
}
