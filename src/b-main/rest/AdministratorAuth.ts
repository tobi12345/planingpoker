import * as Express from "express"
import { IStuff } from ".."
import { checkAdministrator, Administrator } from "../../types-shared/administrator"
import * as jwt from "jsonwebtoken"
import { isCheckError } from "../../types-shared/typechecker"

export const administratorAuth = (stuff: IStuff) => async (
	req: Express.Request,
	res: Express.Response,
	next: Express.NextFunction,
) => {
	const { services, config } = stuff

	const token = (req.query.authToken as string | undefined) ?? req.headers.authorization

	if (!token) {
		return res.status(401).send({ error: "authorization token missing" })
	}

	try {
		const payload = jwt.verify(token, config.jwt.secret)

		const checkerResult = checkAdministrator(payload)

		if (isCheckError(checkerResult)) {
			throw Error()
		}

		await services.administrator.getAdministratorByID(checkerResult[1].id)
		;(req as IAdministratorRequest).administrator = checkerResult[1]

		return next()
	} catch (error) {
		console.log(error)
		return res.status(401).send({ error: "authorization token invalid" })
	}
}

export interface IAdministratorRequest extends Express.Request {
	administrator: Administrator
}

type AdministratorRequestHandler = (
	path: string,
	handler: (req: IAdministratorRequest, res: Express.Response, next: Express.NextFunction) => void,
) => void
export interface IAdministratorAuthRouter {
	use: (router: IAdministratorAuthRouter) => void
	get: AdministratorRequestHandler
	put: AdministratorRequestHandler
	post: AdministratorRequestHandler
	patch: AdministratorRequestHandler
	delete: AdministratorRequestHandler
}

export const AdministratorAuthRouter = () => {
	return (Express.Router() as any) as IAdministratorAuthRouter
}
