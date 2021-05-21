import { useLocation } from "react-router-dom"

export const useURLQuery = () => {
	return new URLSearchParams(useLocation().search)
}
