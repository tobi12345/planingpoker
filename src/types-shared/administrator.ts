import { Keys, TypeString } from "./typechecker"

export interface Administrator {
	id: string
}

export const checkAdministrator = Keys<Administrator>({
	id: TypeString,
})
