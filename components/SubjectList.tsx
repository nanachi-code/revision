import classNames from 'classnames'
import { Alert, Button, Label, Modal, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { useSubjects } from '../lib/fetch'
import type { ApiCreateSubjectResponse } from '../pages/api/subject/create'
import { CheckIcon, EyeIcon, PencilIcon, TrashIcon, XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { ApiDeleteSubjectResponse, ApiEditSubjectResponse } from '../pages/api/subject/[id]'

const SubjectList: React.FC = () => {
	const { subjects, isLoading, isError } = useSubjects()
	const [modalVisible, setModalVisibility] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [title, setTitle] = useState('')
	const { mutate } = useSWRConfig()

	const triggerModalHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
		setModalVisibility(!modalVisible)
	}

	const createSubjectHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		const res = await fetch('/api/subject/create', {
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
		mutate('/api/subject') // trigger swr reload manually
	}

	const cancelCreateSubjectHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
		setTitle('')
		setModalVisibility(false)
	}

	if (isLoading) return <p>Loading...</p>

	if (isError) return <p>Error!</p>

	return (
		<div className="mt-5">
			<h2 className="text-2xl">My subjects</h2>

			<div
				className={classNames({
					hidden: !errorMessage,
				})}
			>
				<Alert color="red">
					<span className="font-medium">{errorMessage}</span>
				</Alert>
			</div>

			<div className="mt-3">
				<Button color="blue" outline={true} onClick={triggerModalHandler}>
					Create
				</Button>
			</div>

			<ul className="mt-3 grid-cols-3 grid gap-4">
				{!subjects || !subjects.length ? (
					<p>No subjects found. </p>
				) : (
					subjects.map(({ title, id }) => <SubjectCard key={id} {...{ id, title, setErrorMessage }} />)
				)}
			</ul>

			<Modal show={modalVisible} size="md">
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
	)
}

export default SubjectList

interface SubjectCardProps {
	id: string
	title: string
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

const SubjectCard: React.FC<SubjectCardProps> = ({ title, id, setErrorMessage }) => {
	const [newTitle, setNewTitle] = useState(title)
	const [isEditing, setIsEditing] = useState(false)
	const { mutate } = useSWRConfig()

	const deleteSubjectHandler: React.MouseEventHandler<HTMLButtonElement> = async (_) => {
		const res = await fetch(`/api/subject/${id}`, {
			method: 'DELETE',
		})

		const data: ApiDeleteSubjectResponse = await res.json()
		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		mutate('/api/subject') // trigger swr reload manually
	}

	const confirmEditHandler: React.MouseEventHandler<HTMLButtonElement> = async (_) => {
		const res = await fetch(`/api/subject/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				newTitle,
			}),
		})

		const data: ApiEditSubjectResponse = await res.json()

		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		mutate('/api/subject') // trigger swr reload manually
	}

	const cancelEditHandler: React.MouseEventHandler<HTMLButtonElement> = (_) => {
		// reset
		setIsEditing(false)
		setNewTitle(title)
	}

	return (
		<li className="border border-black rounded p-5 transition-colors duration-150 hover:bg-slate-200">
			<div
				className={classNames({
					hidden: isEditing,
				})}
			>
				<Link href={`/subject/${id}`} passHref>
					<a className="text-blue-700 underline">{title}</a>
				</Link>
			</div>

			<div
				className={classNames({
					hidden: !isEditing,
				})}
			>
				<TextInput value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
			</div>

			<div className="mt-3 flex gap-1">
				<Button
					size="xs"
					outline
					icon={PencilIcon}
					onClick={() => setIsEditing(!isEditing)}
					className={classNames({
						hidden: isEditing,
					})}
				/>

				<Button
					size="xs"
					outline
					icon={TrashIcon}
					color="red"
					onClick={deleteSubjectHandler}
					className={classNames({
						hidden: isEditing,
					})}
				/>

				<Button
					size="xs"
					outline
					icon={CheckIcon}
					color="green"
					onClick={confirmEditHandler}
					className={classNames({
						hidden: !isEditing,
					})}
				/>

				<Button
					size="xs"
					outline
					icon={XIcon}
					color="red"
					onClick={cancelEditHandler}
					className={classNames({
						hidden: !isEditing,
					})}
				/>
			</div>
		</li>
	)
}
