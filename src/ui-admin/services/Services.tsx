import React, { useContext } from "react"
import axios, { AxiosInstance } from "axios"
import { AdminService } from "./AdminService"
import { PublicService } from "./PublicService"

export type IServices = ReturnType<typeof Services>

export const Services = (api: AxiosInstance) => {
	return {
		admin: AdminService(api),
		_public: PublicService(api),
	}
}

export const ServicesContext = React.createContext<IServices>(Services(axios.create()))

export const useServices = () => useContext(ServicesContext)
