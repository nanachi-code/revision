import { hash } from 'bcrypt'
import type { NextApiHandler } from 'next'
import { prisma } from '../../../lib/prisma'

const handler: NextApiHandler = async (req, res) => {
	await prisma.user.create({
		data: {
			email: req.body.email,
			password: await hash(req.body.password, 10),
		},
	})

	res.status(200).json({ success: true })
}

export default handler
