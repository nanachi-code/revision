import classNames from 'classnames'
import { Pagination, Button, Modal, Label, TextInput, Spinner } from 'flowbite-react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import ErrorAlert from '../../components/ErrorAlert'
import LoggedInLayout from '../../components/LoggedInLayout'
import TopicList from '../../components/TopicList'
import { useSubject, useTopics } from '../../lib/hooks/fetcher'
import { ApiCreateTopicResponse } from '../../types/api/topic'

const SubjectPage: NextPage = () => {
	const router = useRouter()
	const id = router.query.id as string
	const { subject, isLoading: isSubjectLoading, isError: isSubjectError, reload: reloadSubject } = useSubject(id)
	const [topicPage, setTopicPage] = useState(1)
	const {
		topics,
		isLoading: isTopicsLoading,
		isError: isTopicsError,
		reload: reloadTopics,
	} = useTopics(id, topicPage)
	const totalTopicPages = useMemo(() => (subject ? Math.ceil(subject._count.topics / 10) : 0), [subject])
	const [errorMessage, setErrorMessage] = useState('')
	const [modalVisible, setModalVisibility] = useState(false)
	const [text, setText] = useState('')
	const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)

	if (isSubjectError || isTopicsError) setErrorMessage('An unknown error occured')

	const createHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		if (isWaitingForResponse) return

		setIsWaitingForResponse(true)

		const res = await fetch('/api/topic', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text,
				subjectId: id,
			}),
		})

		const data: ApiCreateTopicResponse = await res.json()
		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		setModalVisibility(false)
		setText('')
		reloadTopics()
		reloadSubject()
		setIsWaitingForResponse(false)
	}

	const cancelHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
		setText('')
		setModalVisibility(false)
	}

	return (
		<LoggedInLayout title="Subject">
			<div className="mt-5">
				<Link href="/" passHref>
					<a className="text-blue-700 underline text-sm">Go back</a>
				</Link>

				<h2 className="text-2xl">Subject: {isSubjectLoading ? 'Loading...' : subject?.title}</h2>

				<ErrorAlert errorMessage={errorMessage} />

				<Pagination
					currentPage={topicPage}
					totalPages={totalTopicPages}
					onPageChange={(p) => setTopicPage(p)}
					className={classNames({
						hidden: totalTopicPages <= 1,
					})}
				/>

				<div className="mt-3">
					<Button color="blue" outline={true} onClick={() => setModalVisibility(true)}>
						Create a new topic
					</Button>
				</div>

				<TopicList {...{ topics, reloadTopics, reloadSubject, isLoading: isTopicsLoading, setErrorMessage }} />

				<Modal show={modalVisible} onClose={() => setModalVisibility(false)} size="md">
					<form onSubmit={createHandler}>
						<Modal.Header>Create a new topic</Modal.Header>
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
