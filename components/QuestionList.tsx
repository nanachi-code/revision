import { Question } from '@prisma/client'
import QuestionCard from './QuestionCard'

interface QuestionListProps {
	questions: Question[] | undefined
	isLoading: boolean
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
	reloadQuestions: () => void
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, isLoading, setErrorMessage, reloadQuestions }) => {
	if (isLoading) return <div className="mt-3">Loading...</div>

	return (
		<ul className="mt-3 grid-cols-3 grid gap-4">
			{!questions || !questions.length ? (
				<p>No questions found. </p>
			) : (
				questions.map(({ text, answer, id }) => (
					<QuestionCard key={id} {...{ id, text, answer, setErrorMessage, reloadQuestions }} />
				))
			)}
		</ul>
	)
}

export default QuestionList
