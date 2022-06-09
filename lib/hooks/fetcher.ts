import useSWR from 'swr'
import { ApiGetQuestionResponse, ApiGetQuestionsResponse } from '../../types/api/question'
import type { ApiGetSubjectsResponse, ApiGetSubjectResponse } from '../../types/api/subject'
import type { ApiGetTopicResponse, ApiGetTopicsResponse } from '../../types/api/topic'

type Fetcher = (input: RequestInfo) => Promise<any>
const fetcher: Fetcher = (...args) => fetch(...args).then((res) => res.json())

export function useSubjects(page: number = 1) {
	const { data, error, mutate } = useSWR<ApiGetSubjectsResponse>(`/api/subject?p=${page}`, fetcher)

	return {
		subjects: data?.subjects,
		totalCount: data?.totalCount,
		isLoading: !error && !data,
		isError: error,
		reload: mutate,
	}
}

export function useSubject(subjectId: string) {
	const { data, error, mutate } = useSWR<ApiGetSubjectResponse>(`/api/subject/${subjectId}`, fetcher)

	return {
		subject: data?.subject,
		isLoading: !error && !data,
		isError: error,
		reload: mutate,
	}
}

export function useTopics(subjectId: string, page: number = 1) {
	const { data, error, mutate } = useSWR<ApiGetTopicsResponse>(`/api/topic?subjectId=${subjectId}&p=${page}`, fetcher)

	return {
		topics: data?.topics,
		isLoading: !error && !data,
		isError: error,
		reload: mutate,
	}
}

export function useTopic(topicId: string) {
	const { data, error, mutate } = useSWR<ApiGetTopicResponse>(`/api/topic/${topicId}`, fetcher)

	return {
		topic: data?.topic,
		isLoading: !error && !data,
		isError: error,
		reload: mutate,
	}
}

export function useQuestions(topicId: string, page: number = 1) {
	const { data, error, mutate } = useSWR<ApiGetQuestionsResponse>(
		`/api/question?topicId=${topicId}&p=${page}`,
		fetcher
	)

	return {
		questions: data?.questions,
		isLoading: !error && !data,
		isError: error,
		reload: mutate,
	}
}

export function useQuestion(questionId: string) {
	const { data, error, mutate } = useSWR<ApiGetQuestionResponse>(`/api/question/${questionId}`, fetcher)

	return {
		question: data?.question,
		isLoading: !error && !data,
		isError: error,
		reload: mutate,
	}
}
