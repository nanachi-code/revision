import type { NextPage } from 'next'
import { signIn } from 'next-auth/react'

const Home: NextPage = () => {
	return (
		<>
			<button onClick={() => signIn('credentials')}>sign in</button>
		</>
	)
}

export default Home
