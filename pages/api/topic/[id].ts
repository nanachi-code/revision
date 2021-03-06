import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prisma'
import type { ApiDeleteTopicResponse, ApiGetTopicResponse, ApiEditTopicResponse } from '../../../types/api/topic'

const handler: NextApiHandler<ApiDeleteTopicResponse | ApiGetTopicResponse | ApiEditTopicResponse> = async (
	req,
	res
) => {
	const session = await getSession({ req })

	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	if (req.method == 'GET') {
		if (req.query.id == 'undefined')
			return res.status(200).json({
				message: "UNDEFINED",
			})

		const topic = await prisma.topic.findUnique({
			where: {
				id: req.query.id as string,
			},
			include: {
				_count: {
					select: {
						questions: true,
					},
				},
			},
		})

		return res.status(200).json({
			topic,
		})
	} else if (req.method == 'DELETE') {
		try {
			await prisma.question.deleteMany({
				where: {
					topicId: req.query.id as string,
				},
			})

			await prisma.topic.delete({
				where: {
					id: req.query.id as string,
				},
			})

			return res.status(200).json({
				ok: true,
			})
		} catch (error) {
			console.log(error)

			return res.status(200).json({
				ok: false,
			})
		}
	} else if (req.method == 'PATCH') {
		const topic = await prisma.topic.update({
			where: {
				id: req.query.id as string,
			},
			data: {
				text: req.body.newText,
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
