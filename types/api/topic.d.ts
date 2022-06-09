import type { Question, Topic } from '@prisma/client'

export interface ApiGetTopicsResponse {
	topics?: Topic[]
	message?: string
}

export interface ApiCreateTopicResponse {
	ok?: boolean
	message?: string
}

export interface ApiDeleteTopicResponse {
	ok?: boolean
	message?: string
}

export interface ApiEditTopicResponse {
	ok?: boolean
	message?: string
}

export interface ApiGetTopicResponse {
	topic?: (Topic & { _count: { questions: number } }) | null
	message?: string
}
