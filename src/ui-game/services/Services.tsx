import React, { useContext } from "react"
import axios, { AxiosInstance } from "axios"
import { GameService } from "./GameService"

export type IServices = ReturnType<typeof Services>

export const Services = (api: AxiosInstance) => {
	return {
		game: GameService(api),
	}
}

export const ServicesContext = React.createContext<IServices>(Services(axios.create()))

export const useServices = () => useContext(ServicesContext)
