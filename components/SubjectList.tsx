import type { Subject } from '@prisma/client'
import SubjectCard from './SubjectCard'

interface SubjectListProps {
	subjects: Subject[] | undefined
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
	reloadSubjects: () => void
	isLoading: boolean
}

const SubjectList: React.FC<SubjectListProps> = ({ subjects, setErrorMessage, reloadSubjects, isLoading }) => {
	if (isLoading) return <div className="mt-3">Loading...</div>

	return (
		<ul className="mt-3 sm:grid-cols-3 grid gap-4 grid-cols-1">
			{!subjects || !subjects.length ? (
				<p>No subjects found. </p>
			) : (
				subjects.map(({ title, id }) => (
					<SubjectCard key={id} {...{ id, title, setErrorMessage, reloadSubjects }} />
				))
			)}
		</ul>
	)
}

export default SubjectList
