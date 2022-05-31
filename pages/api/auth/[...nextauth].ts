import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../../../lib/prisma'
import { compare } from 'bcrypt'

export default NextAuth({
	providers: [
		CredentialsProvider({
			credentials: {
				email: {
					label: 'email',
					type: 'email',
				},
				password: {
					label: 'password',
					type: 'password',
				},
			},
			async authorize(credentials, _) {
				if (!credentials || !credentials.email || !credentials.password) return null

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				})

				if (!user || !(await compare(credentials.password, user.password))) return null

				return user
			},
		}),
	],
})
