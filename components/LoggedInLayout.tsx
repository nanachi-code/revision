import Layout from './Layout'
import { signOut, useSession } from 'next-auth/react'

interface LoggedInLayoutProps {
	title?: string
	children: React.ReactNode
}

const LoggedInLayout: React.FC<LoggedInLayoutProps> = ({ children, title }) => {
	const { data: session, status } = useSession({
		required: true,
	})

	if (status === 'loading') {
		return (
			<Layout {...{ title }}>
				<div className="text-center">Loading...</div>
			</Layout>
		)
	}

	return (
		<Layout {...{ title }}>
			<div className="text-center">
				Signed in as {session?.user?.email}{' '}
				<button className="text-blue-700 underline" onClick={() => signOut()}>
					Sign out
				</button>
			</div>
			{children}
		</Layout>
	)
}

export default LoggedInLayout
