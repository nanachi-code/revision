import classNames from 'classnames'
import { Modal, Label, TextInput, Button, Pagination, Textarea, Spinner } from 'flowbite-react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import ErrorAlert from '../../components/ErrorAlert'
import LoggedInLayout from '../../components/LoggedInLayout'
import QuestionList from '../../components/QuestionList'
import { useQuestions, useTopic } from '../../lib/hooks/fetcher'
import { ApiCreateQuestionResponse } from '../../types/api/question'

const SubjectPage: NextPage = () => {
	const router = useRouter()
	const id = router.query.id as string
	const { topic, isLoading: isTopicLoading, isError: isTopicError, reload: reloadTopic } = useTopic(id)
	const [questionPage, setQuestionPage] = useState(1)
	const {
		questions,
		isLoading: isQuestionsLoading,
		isError: isQuestionsError,
		reload: reloadQuestions,
	} = useQuestions(id, questionPage)
	const totalQuestionPages = useMemo(() => (topic ? Math.ceil(topic._count.questions / 10) : 0), [topic])
	const [errorMessage, setErrorMessage] = useState('')
	const [modalVisible, setModalVisibility] = useState(false)
	const [text, setText] = useState('')
	const [answer, setAnswer] = useState('')
	const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)

	if (isTopicError || isQuestionsError) setErrorMessage('An unknown error occured')

	const createHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		if (isWaitingForResponse) return

		setIsWaitingForResponse(true)

		const res = await fetch('/api/question', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text,
				answer,
				topicId: id,
			}),
		})

		const data: ApiCreateQuestionResponse = await res.json()
		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		setModalVisibility(false)
		setText('')
		setAnswer('')
		reloadQuestions()
		reloadTopic()
		setIsWaitingForResponse(false)
	}

	const cancelHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
		setText('')
		setAnswer('')
		setModalVisibility(false)
	}

	return (
		<LoggedInLayout title="Topic">
			<div className="mt-5">
				<Link href={`/subject/${topic?.subjectId}`} passHref>
					<a className="text-blue-700 underline text-sm">Go back</a>
				</Link>

				<h2 className="text-2xl">Topic: {isTopicLoading ? 'Loading...' : topic?.text}</h2>

				<ErrorAlert errorMessage={errorMessage} />

				<Pagination
					currentPage={questionPage}
					totalPages={totalQuestionPages}
					onPageChange={(p) => setQuestionPage(p)}
					className={classNames({
						hidden: totalQuestionPages <= 1,
					})}
				/>

				<div className="mt-3">
					<Button color="blue" outline={true} onClick={() => setModalVisibility(true)}>
						Create a new question
					</Button>
				</div>

				<QuestionList
					{...{ questions, isLoading: isQuestionsLoading, setErrorMessage, reloadQuestions, reloadTopic }}
				/>

				<Modal show={modalVisible} onClose={() => setModalVisibility(false)} size="md">
					<form onSubmit={createHandler}>
						<Modal.Header>Create a new question</Modal.Header>
						<Modal.Body>
							<div className="flex flex-col gap-4">
								<div>
									<Label className="mb-2 block" htmlFor="title">
										Text
									</Label>
									<TextInput
										id="text"
										placeholder="Text"
										value={text}
										onChange={(e) => setText(e.target.value)}
										required
									/>
								</div>

								<div>
									<Label className="mb-2 block" htmlFor="title">
										Answer
									</Label>
									<Textarea
										id="answer"
										placeholder="Answer"
										value={answer}
										onChange={(e) => setAnswer(e.target.value)}
										rows={4}
										required
									/>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button type="submit" disabled={isWaitingForResponse}>
								{isWaitingForResponse ? <Spinner /> : 'Create'}
							</Button>
							<Button type="button" color="light" onClick={cancelHandler} disabled={isWaitingForResponse}>
								Cancel
							</Button>
						</Modal.Footer>
					</form>
				</Modal>
			</div>
		</LoggedInLayout>
	)
}

export default SubjectPage
