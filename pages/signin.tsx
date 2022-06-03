import type { InferGetServerSidePropsType, NextPage } from 'next'
import { useState } from 'react'
import { getCsrfToken, signIn, SignInResponse } from 'next-auth/react'
import type { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useRouter } from 'next/router'
import classNames from 'classnames'

const SignIn: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
		setLoading(true)

		const res = await signIn<'credentials'>('credentials', {
			email,
			password,
			redirect: false,
		})

		if (res) {
			const { ok, error } = res
			if (ok) return router.push('/')

			switch (error) {
				case 'CredentialsSignin':
					setErrorMessage('Invalid email or password')
					break

				default:
					setErrorMessage('An unknown error occurred')
					break
			}
			setLoading(false)
		}
	}

	return (
		<Layout>
			<div className="flex items-center justify-center">
				<form onSubmit={formSubmitHandler} className="w-1/3 flex flex-col gap-4">
					<div className="text-center">
						<h2 className="text-xl mb-3">Sign in</h2>
					</div>

					<div
						className={classNames({
							hidden: !errorMessage,
						})}
					>
						<Alert color="red">
							<span className="font-medium">{errorMessage}</span>
						</Alert>
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
						<Button className="mx-auto" color="blue" outline type="submit" disabled={loading}>
							{loading ?? <Spinner aria-label="Sign in" />}
							Sign in
						</Button>

						<div>
							No account?{' '}
							<Link href="/signup" passHref>
								<a className="text-blue-700 underline">Sign up</a>
							</Link>
						</div>
					</div>
				</form>
			</div>
		</Layout>
	)
}

export default SignIn

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	}
}
