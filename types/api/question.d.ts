import type { Question } from '@prisma/client'

export interface ApiDeleteQuestionResponse {
	ok?: boolean
	message?: string
}

export interface ApiEditQuestionResponse {
	ok?: boolean
	message?: string
}

export interface ApiGetQuestionResponse {
	question?: Question | null
	message?: string
}

export interface ApiGetQuestionsResponse {
	questions?: Question[]
	message?: string
}

export interface ApiCreateQuestionResponse {
	ok?: boolean
	message?: string
}
