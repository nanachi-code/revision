import { PencilIcon, TrashIcon, CheckIcon, XIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { TextInput, Button } from 'flowbite-react'
import Link from 'next/link'
import { useState } from 'react'
import { ApiDeleteSubjectResponse, ApiEditSubjectResponse } from '../types/api/subject'

interface SubjectCardProps {
	id: string
	title: string
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
	reloadSubjects: () => void
}

const SubjectCard: React.FC<SubjectCardProps> = ({ title, id, setErrorMessage, reloadSubjects }) => {
	const [newTitle, setNewTitle] = useState(title)
	const [isEditing, setIsEditing] = useState(false)

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

		reloadSubjects()
	}

	const confirmEditHandler: React.MouseEventHandler<HTMLButtonElement> = async (_) => {
		if (newTitle == title) {
			setIsEditing(false)
			return
		}

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

		setIsEditing(false)
		reloadSubjects()
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
					onClick={() => setIsEditing(true)}
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

export default SubjectCard
