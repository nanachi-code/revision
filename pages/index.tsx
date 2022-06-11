import { Button, Label, Modal, Pagination, TextInput } from 'flowbite-react'
import type { NextPage } from 'next/types'
import { useState, useMemo } from 'react'
import ErrorAlert from '../components/ErrorAlert'
import LoggedInLayout from '../components/LoggedInLayout'
import SubjectList from '../components/SubjectList'
import { useSubjects } from '../lib/hooks/fetcher'
import { ApiCreateSubjectResponse } from '../types/api/subject'

const Home: NextPage = () => {
	const [page, setPage] = useState(1)
	const { totalCount, subjects, isLoading, isError, reload: reloadSubjects } = useSubjects(page)
	const totalPages = useMemo(() => (totalCount ? Math.ceil(totalCount / 9) : 0), [totalCount])
	const [modalVisible, setModalVisibility] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [title, setTitle] = useState('')

	const createSubjectHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		const res = await fetch('/api/subject', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
			}),
		})

		const data: ApiCreateSubjectResponse = await res.json()
		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		setModalVisibility(false)
		setTitle('')
		reloadSubjects()
	}

	const cancelCreateSubjectHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
		setTitle('')
		setModalVisibility(false)
	}

	if (isError) setErrorMessage('An unknown error occured')

	return (
		<LoggedInLayout title='My subjects'>
			<div className="mt-5">
				<h2 className="text-2xl">My subjects</h2>

				<ErrorAlert errorMessage={errorMessage} />

				<div className="mt-3">
					<Button color="blue" outline={true} onClick={() => setModalVisibility(true)}>
						Create a new subject
					</Button>
				</div>

				<Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

				<SubjectList {...{ subjects, setErrorMessage, reloadSubjects, isLoading }} />

				<Modal show={modalVisible} onClose={() => setModalVisibility(false)} size="md">
					<form onSubmit={createSubjectHandler}>
						<Modal.Header>Create a new subject</Modal.Header>
						<Modal.Body>
							<div className="flex flex-col gap-4">
								<div>
									<Label className="mb-2 block" htmlFor="title">
										Title
									</Label>
									<TextInput
										id="title"
										placeholder="Title"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										required
									/>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button type="submit">Create</Button>
							<Button type="button" onClick={cancelCreateSubjectHandler}>
								Cancel
							</Button>
						</Modal.Footer>
					</form>
				</Modal>
			</div>
		</LoggedInLayout>
	)
}

export default Home
