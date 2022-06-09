import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prisma'
import { ApiGetSubjectsResponse, ApiCreateSubjectResponse } from '../../../types/api/subject'

const handler: NextApiHandler<ApiGetSubjectsResponse | ApiCreateSubjectResponse> = async (req, res) => {
	const session = await getSession({ req })

	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	if (req.method == 'GET') {
		const [count, subjects] = await prisma.$transaction([
			prisma.subject.count(),
			prisma.subject.findMany({
				where: {
					userId: session.user.id,
				},
				skip: (parseInt(req.query.p as string) - 1) * 9,
				take: 9,
			}),
		])

		return res.status(200).json({
			subjects,
			totalCount: count,
		})
	} else if (req.method == 'POST') {
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
}

export default handler
