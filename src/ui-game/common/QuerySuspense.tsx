import React from "react"
import styled from "styled-components"
import Spin, { SpinProps } from "antd/lib/spin"

interface SuspenseProps<T> {
	data: T | null | undefined
	isLoading?: boolean
	error?: any
	errors?: (Error | null)[] | null
	fallback?: {
		loading?: React.ReactNode
		error?: ((error: Error) => React.ReactNode) | React.ReactNode
		noData?: React.ReactNode
	}
	children: (data: T) => any
}

export const QuerySuspense = <T extends any>(props: SuspenseProps<T>) => {
	const { data, isLoading, error, errors, fallback, children } = props

	if (isLoading === true) {
		return fallback && fallback.loading ? fallback.loading : <CenteredSpinner />
	}

	const displayError = error || errors?.find((err) => !!err)
	if (displayError) {
		if (fallback && fallback.error) {
			const errorFallback = fallback.error

			if (typeof errorFallback === "function") {
				return errorFallback(displayError)
			}

			return errorFallback
		} else {
			return <div>{displayError.toString()}</div>
		}
	}
	if (!data) {
		return fallback && fallback.noData ? fallback.noData : <div>Keine Daten</div>
	}

	return children(data)
}

const FlexCenter = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-items: center;
`

const CenteredSpinner: React.FC<SpinProps> = (props) => (
	<FlexCenter>
		<Spin {...props} />
	</FlexCenter>
)
