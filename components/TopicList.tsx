import type { Topic } from '@prisma/client'
import TopicCard from './TopicCard'

interface TopicCardListProps {
	topics: Topic[] | undefined
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
	isLoading: boolean
	reloadTopics: () => void
	reloadSubject: () => void
}

const TopicList: React.FC<TopicCardListProps> = ({
	isLoading,
	topics,
	setErrorMessage,
	reloadTopics,
	reloadSubject,
}) => {
	if (isLoading) {
		return <div className="mt-3">Loading...</div>
	}

	return (
		<ul className="mt-3 grid-cols-1 grid gap-4">
			{!topics || !topics.length ? (
				<p>No topics found. </p>
			) : (
				topics.map(({ text, id }) => (
					<TopicCard key={id} {...{ id, text, setErrorMessage, reloadTopics, reloadSubject }} />
				))
			)}
		</ul>
	)
}

export default TopicList
