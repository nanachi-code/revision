import { hash } from 'bcrypt'
import type { NextApiHandler } from 'next'
import { prisma } from '../../../lib/prisma'
import type { ApiSignupResponse } from '../../../types/api/auth'

const handler: NextApiHandler<ApiSignupResponse> = async (req, res) => {
	const user = await prisma.user.create({
		data: {
			email: req.body.email,
			password: await hash(req.body.password, 10),
		},
	})

	res.status(200).json({ ok: user ? true : false })
}

export default handler
