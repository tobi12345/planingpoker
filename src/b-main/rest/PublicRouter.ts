import { Router } from "express"
import { isCheckError, Keys, TypeString } from "../../types-shared/typechecker"
import * as jwt from "jsonwebtoken"
import { IStuff } from ".."
import * as crypto from "crypto"

const hmac = (secret: string, value: string) => crypto.createHmac("sha512", secret).update(value).digest("hex")

export const PublicRouter = (stuff: IStuff) => {
	const { config, services } = stuff
	const router = Router()

	const checkLoginRequest = Keys({
		body: Keys({
			email: TypeString,
			password: TypeString,
		}),
	})

	router.post("/login", async (req, res) => {
		const checkerResult = checkLoginRequest(req)

		if (isCheckError(checkerResult)) {
			return void res.status(403).json({ errors: checkerResult[0] })
		}

		const { email, password } = checkerResult[1].body

		try {
			const user = await services.administrator.getAdministratorByEmailPassword(
				email,
				hmac(config.passwordSecret, password),
			)
			const token = jwt.sign(user, config.jwt.secret, {
				expiresIn: "365d",
				//expiresIn: 10,
			})

			res.json({ token })
		} catch (err) {
			return res.status(400).send({ error: "EMail or Password wrong" })
		}
	})

	return router
}
