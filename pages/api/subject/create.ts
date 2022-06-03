import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prisma'

export interface ApiCreateSubjectResponse {
	ok?: boolean
	message?: string
}

const handler: NextApiHandler<ApiCreateSubjectResponse> = async (req, res) => {
	if (req.method !== 'POST') return

	const session = await getSession({ req })

	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	const subject = await prisma.subject.create({
		data: {
			title: req.body.title,
			user: {
				connect: {
					email: session.user.email,
				},
			},
		},
	})

	return res.status(200).json({
		ok: subject ? true : false,
	})
}

export default handler
