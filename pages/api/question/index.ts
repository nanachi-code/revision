import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prisma'
import { ApiGetQuestionsResponse, ApiCreateQuestionResponse } from '../../../types/api/question'

const handler: NextApiHandler<ApiGetQuestionsResponse | ApiCreateQuestionResponse> = async (req, res) => {
	const session = await getSession({ req })

	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	if (req.method == 'GET') {
		console.log(req.query)

		const questions = await prisma.question.findMany({
			where: {
				topicId: req.query.topicId as string,
			},
			skip: (parseInt(req.query.p as string) - 1) * 9,
			take: 9,
		})

		return res.status(200).json({
			questions,
		})
	} else if (req.method == 'POST') {
		const question = await prisma.question.create({
			data: {
				text: req.body.text,
				answer: req.body.answer,
				topic: {
					connect: {
						id: req.body.topicId,
					},
				},
			},
		})

		return res.status(200).json({
			ok: question ? true : false,
		})
	} else {
		res.status(404)
	}
}

export default handler
