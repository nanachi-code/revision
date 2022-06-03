import { Subject } from '@prisma/client'
import useSWR from 'swr'
import { ApiGetSubjectsResponse } from '../pages/api/subject'

type Fetcher = (input: RequestInfo) => Promise<any>
const fetcher: Fetcher = (...args) => fetch(...args).then((res) => res.json())

export function useSubjects() {
	const { data, error } = useSWR<ApiGetSubjectsResponse>(`/api/subject`, fetcher)

	return {
		subjects: data?.subjects,
		isLoading: !error && !data,
		isError: error,
	}
}
