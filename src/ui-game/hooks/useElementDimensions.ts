import { useState, useRef, useEffect, useCallback } from "react"
import { debounce } from "lodash"

export const useElementDimensions = <T = HTMLDivElement>() => {
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)
	const ref = useRef<T>(null)

	const setDimensions = useCallback(
		debounce(() => {
			if (ref.current) {
				setHeight((ref.current as any).clientHeight)
				setWidth((ref.current as any).clientWidth)
			}
		}, 300),
		[],
	)

	useEffect(() => {
		setDimensions()

		window.addEventListener("resize", setDimensions)
		return () => {
			window.removeEventListener("resize", setDimensions)
		}
	}, [setDimensions])

	return {
		width,
		height,
		ref,
	}
}
