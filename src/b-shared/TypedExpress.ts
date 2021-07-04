import Express from "express"
import { Checker, isCheckError } from "../types-shared/typechecker"
import { HTTPStatusCodes } from "./HTTPStatusCodes"

export type TypedRequestHandler<Request> = (
	request: Request,
	response: Express.Response,
	next: Express.NextFunction,
) => void | Promise<void>

export type CheckedRequestHandler<Request, B> = (
	request: Request,
	checked: B,
	response: Express.Response,
	next: Express.NextFunction,
) => void | Promise<void>

interface CheckedRequest {
	query?: object
	params?: object
	body?: object
	header?: object
}
export const CheckRequestConvert = <R, B>(
	checker: Checker<CheckedRequest, B>,
	handler: CheckedRequestHandler<R, B>,
): TypedRequestHandler<R> => (request, response, next) => {
	const result = checker(request)
	if (isCheckError(result)) {
		return void response.status(HTTPStatusCodes.BAD_REQUEST).send({ errors: result[0] })
	}
	return handler(request, result[1], response, next)
}

export const ErrorHandlerChecked = <Request, B>(
	request: CheckedRequestHandler<Request, B>,
): CheckedRequestHandler<Request, B> => async (req, checked, res, next) => {
	try {
		await request(req, checked, res, next)
	} catch (err) {
		console.log(err)

		if (err instanceof NotFoundError) {
			res.status(HTTPStatusCodes.NOT_FOUND).json({ error: err.message })
			return
		} else if (err instanceof UnauthorizedError) {
			res.status(HTTPStatusCodes.UNAUTHORIZED).json({ error: err.message })
			return
		}

		res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).end()
	}
}

type BaseRequestHandler = (
	path: string,
	...handler: Array<(req: Express.Request, res: Express.Response, next: Express.NextFunction) => void>
) => void
export interface IBaseRouter {
	use: (router: IBaseRouter) => void
	get: BaseRequestHandler
	put: BaseRequestHandler
	post: BaseRequestHandler
	patch: BaseRequestHandler
	delete: BaseRequestHandler
}

export const BaseRouter = () => {
	return (Express.Router() as any) as IBaseRouter
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message)
	}
}

export class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message)
	}
}
