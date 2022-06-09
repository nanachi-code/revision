import type { Subject } from '@prisma/client'

export interface ApiDeleteSubjectResponse {
	ok?: boolean
	message?: string
}

export interface ApiEditSubjectResponse {
	ok?: boolean
	message?: string
}

export interface ApiGetSubjectResponse {
	subject?: (Subject & { _count: { topics: number } }) | null
	message?: string
}

export interface ApiGetSubjectsResponse {
	totalCount: number
	subjects?: Subject[]
	message?: string
}

export interface ApiCreateSubjectResponse {
	ok?: boolean
	message?: string
}
