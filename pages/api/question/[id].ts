import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prisma'
import type {
	ApiDeleteQuestionResponse,
	ApiEditQuestionResponse,
	ApiGetQuestionResponse,
} from '../../../types/api/question'

const handler: NextApiHandler<ApiDeleteQuestionResponse | ApiGetQuestionResponse | ApiEditQuestionResponse> = async (
	req,
	res
) => {
	const session = await getSession({ req })

	if (!session || !session.user) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	if (req.method == 'GET') {
		const question = await prisma.question.findUnique({
			where: {
				id: req.query.id as string,
			},
		})

		return res.status(200).json({
			question,
		})
	} else if (req.method == 'DELETE') {
		const question = await prisma.question.delete({
			where: {
				id: req.query.id as string,
			},
		})

		return res.status(200).json({
			ok: question ? true : false,
		})
	} else if (req.method == 'PATCH') {
		const question = await prisma.question.update({
			where: {
				id: req.query.id as string,
			},
			data: {
				text: req.body.newText,
				answer: req.body.newAnswer,
			},
		})

		return res.status(200).json({
			ok: question ? true : false,
		})
	}
}

export default handler
