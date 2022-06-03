import type { InferGetServerSidePropsType, NextPage } from 'next'
import { useState } from 'react'
import { getCsrfToken, signIn } from 'next-auth/react'
import type { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Label, TextInput, Button } from 'flowbite-react'
import { ApiSignupResponse } from './api/auth/signup'

const SignUp: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
		const res = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-Token': csrfToken,
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
		const data: ApiSignupResponse = await res.json()
		if (data.ok)
			signIn('credentials', {
				email,
				password,
				callbackUrl: '/',
			})
	}

	return (
		<Layout>
			<div className="flex items-center justify-center">
				<form onSubmit={formSubmitHandler} className="w-1/3 flex flex-col gap-4">
					<div className="text-center">
						<h2 className="text-xl mb-3">Sign up</h2>
					</div>

					<input name="csrfToken" type="hidden" defaultValue={csrfToken} />

					<div>
						<Label className="mb-2 block" htmlFor="email">
							Email
						</Label>
						<TextInput
							id="email"
							placeholder="Email"
							value={email}
							type="email"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<Label className="mb-2 block" htmlFor="password">
							Password
						</Label>
						<TextInput
							id="password"
							placeholder="Password"
							value={password}
							type="password"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="text-center">
						<Button color="blue" outline className="mx-auto" type="submit">
							Sign up
						</Button>

						<div>
							Already have an account?{' '}
							<Link href="/signin" passHref>
								<a className="text-blue-700 underline">Sign in</a>
							</Link>
						</div>
					</div>
				</form>
			</div>
		</Layout>
	)
}

export default SignUp

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	}
}
