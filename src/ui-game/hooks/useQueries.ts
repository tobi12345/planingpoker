import { PaginatedQueryResult, QueryResult } from "react-query"

const isPaginatedQuery = (obj: any): obj is MinimumPaginatedQueryResult<unknown> => "latestData" in obj

export type MinimumQueryResult<TResult> = Pick<
	QueryResult<TResult>,
	"isLoading" | "isFetching" | "error" | "status" | "data"
>
export type MinimumPaginatedQueryResult<TResult> = Pick<
	PaginatedQueryResult<TResult>,
	"isLoading" | "isFetching" | "error" | "status" | "resolvedData"
>

export interface QueriesState<TQ> {
	isLoading: boolean
	isFetching: boolean
	errors: (Error | null)[] | null
	data: TQ | undefined
}

export function useQueries<Q1, Q2>(
	query1: MinimumQueryResult<Q1> | MinimumPaginatedQueryResult<Q1>,
	query2: MinimumQueryResult<Q2> | MinimumPaginatedQueryResult<Q2>,
): QueriesState<[Q1, Q2]>
export function useQueries<Q1, Q2, Q3>(
	query1: MinimumQueryResult<Q1> | MinimumPaginatedQueryResult<Q1>,
	query2: MinimumQueryResult<Q2> | MinimumPaginatedQueryResult<Q2>,
	query3: MinimumQueryResult<Q3> | MinimumPaginatedQueryResult<Q3>,
): QueriesState<[Q1, Q2, Q3]>
export function useQueries<Q1, Q2, Q3, Q4>(
	query1: MinimumQueryResult<Q1> | MinimumPaginatedQueryResult<Q1>,
	query2: MinimumQueryResult<Q2> | MinimumPaginatedQueryResult<Q2>,
	query3: MinimumQueryResult<Q3> | MinimumPaginatedQueryResult<Q3>,
	query4: MinimumQueryResult<Q4> | MinimumPaginatedQueryResult<Q4>,
): QueriesState<[Q1, Q2, Q3, Q4]>
export function useQueries(
	...queries: (MinimumQueryResult<unknown> | MinimumPaginatedQueryResult<unknown>)[]
): QueriesState<unknown[]> {
	const isLoading = queries.some((query) => query.isLoading)
	const isFetching = queries.some((query) => query.isFetching)

	if (isLoading === true) {
		return { isLoading, isFetching, data: undefined, errors: null }
	}

	if (queries.some((query) => query.error)) {
		return {
			isLoading,
			isFetching,
			data: undefined,
			errors: queries.map((query) => query.error as Error),
		}
	}

	if (queries.some((query) => query.status === "idle")) {
		return {
			isLoading,
			isFetching,
			errors: null,
			data: undefined,
		}
	}

	return {
		isLoading,
		isFetching,
		errors: null,
		data: queries.map((query) => (isPaginatedQuery(query) ? query.resolvedData : query.data)),
	}
}

export const getError = (errors: (Error | null)[] | null): Error | null =>
	(errors || []).find((error) => !!error) || null
