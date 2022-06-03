import type { NextPage } from 'next/types'
import LoggedInLayout from '../components/LoggedInLayout'
import SubjectList from '../components/SubjectList'

const Home: NextPage = () => {
	return (
		<LoggedInLayout>
			<SubjectList />
		</LoggedInLayout>
	)
}

export default Home
