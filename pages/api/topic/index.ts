import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prisma'
import { ApiGetTopicsResponse, ApiCreateTopicResponse } from '../../../types/api/topic'

const handler: NextApiHandler<ApiGetTopicsResponse | ApiCreateTopicResponse> = async (req, res) => {
	const session = await getSession({ req })

	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	if (req.method == 'GET') {
		const topics = await prisma.topic.findMany({
			where: {
				subjectId: req.query.subjectId as string,
			},
			skip: (parseInt(req.query.p as string) - 1) * 9,
			take: 9,
		})

		return res.status(200).json({
			topics,
		})
	} else if (req.method == 'POST') {
		const topic = await prisma.topic.create({
			data: {
				text: req.body.text,
				subject: {
					connect: {
						id: req.body.subjectId,
					},
				},
			},
		})

		return res.status(200).json({
			ok: topic ? true : false,
		})
	} else {
		res.status(404)
	}
}

export default handler
