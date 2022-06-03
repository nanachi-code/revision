import { Subject } from '@prisma/client'
import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prisma'

export interface ApiGetSubjectsResponse {
	subjects?: Subject[]
	message?: string
}

const handler: NextApiHandler<ApiGetSubjectsResponse> = async (req, res) => {
	const session = await getSession({ req })

	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	const subjects = await prisma.subject.findMany({
		where: {
			userId: session.user.id,
		},
	})

	return res.status(200).json({
		subjects,
	})
}

export default handler
