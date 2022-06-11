import { Question } from '@prisma/client'
import QuestionCard from './QuestionCard'

interface QuestionListProps {
	questions: Question[] | undefined
	isLoading: boolean
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
	reloadQuestions: () => void
	reloadTopic: () => void
}

const QuestionList: React.FC<QuestionListProps> = ({
	questions,
	isLoading,
	setErrorMessage,
	reloadQuestions,
	reloadTopic,
}) => {
	if (isLoading) return <div className="mt-3">Loading...</div>

	return (
		<ul className="mt-3 sm:grid-cols-2 grid gap-4 grid-cols-1">
			{!questions || !questions.length ? (
				<p>No questions found. </p>
			) : (
				questions.map(({ text, answer, id }) => (
					<QuestionCard key={id} {...{ id, text, answer, setErrorMessage, reloadQuestions, reloadTopic }} />
				))
			)}
		</ul>
	)
}

export default QuestionList
