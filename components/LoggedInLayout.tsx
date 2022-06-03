import Layout from './Layout'
import { signOut, useSession } from 'next-auth/react'

interface LoggedInLayoutProps {
	children?: React.ReactNode
}

const LoggedInLayout: React.FC<LoggedInLayoutProps> = ({ children }) => {
	const { data: session, status } = useSession({
		required: true,
	})

	if (status === 'loading') {
		return (
			<Layout>
				<div className="text-center">Loading...</div>
			</Layout>
		)
	}

	return (
		<Layout>
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
