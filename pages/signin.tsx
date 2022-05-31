import type { InferGetServerSidePropsType, NextPage } from 'next'
import { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { getCsrfToken, signIn } from 'next-auth/react'
import type { GetServerSideProps } from 'next'

const SignIn: NextPage = ({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	return (
		<div className="flex items-center justify-center">
			<form
				onSubmit={() =>
					signIn('credentials', {
						email,
						password,
						callbackUrl: '/my-subject',
					})
				}
				className="w-1/3"
			>
				<h1 className="text-3xl mb-3">Sign in</h1>

				<input
					name="csrfToken"
					type="hidden"
					defaultValue={csrfToken}
				/>

				<TextInput
					id="email-input"
					className="rounded block w-full"
					label="Email"
					placeholder="Email"
					value={email}
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<TextInput
					id="password-input"
					className="rounded block w-full"
					placeholder="Password"
					label="Password"
					value={password}
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<div className="flex justify-center">
					<Button
						className="bg-sky-500 hover:bg-sky-700 px-9"
						type="submit"
					>
						Sign in
					</Button>
				</div>
			</form>
		</div>
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
