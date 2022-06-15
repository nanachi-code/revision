import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/prisma'
import type {
	ApiDeleteSubjectResponse,
	ApiEditSubjectResponse,
	ApiGetSubjectResponse,
} from '../../../types/api/subject'

const handler: NextApiHandler<ApiDeleteSubjectResponse | ApiGetSubjectResponse | ApiEditSubjectResponse> = async (
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
				message: 'UNDEFINED',
			})

		const subject = await prisma.subject.findUnique({
			where: {
				id: req.query.id as string,
			},
			include: {
				_count: {
					select: {
						topics: true,
					},
				},
			},
		})

		return res.status(200).json({
			subject,
		})
	} else if (req.method == 'DELETE') {
		try {
			const topicIds = await prisma.topic.findMany({
				where: {
					subjectId: req.query.id as string,
				},
				select: {
					id: true,
				},
			})

			await prisma.question.deleteMany({
				where: {
					topicId: {
						in: topicIds.map((topic) => topic.id),
					},
				},
			})

			await prisma.topic.deleteMany({
				where: {
					subjectId: req.query.id as string,
				},
			})

			await prisma.subject.delete({
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
		const subject = await prisma.subject.update({
			where: {
				id: req.query.id as string,
			},
			data: {
				title: req.body.newTitle,
			},
		})

		return res.status(200).json({
			ok: subject ? true : false,
		})
	}
}

export default handler
