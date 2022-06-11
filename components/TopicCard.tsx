import { PencilIcon, TrashIcon, CheckIcon, XIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { TextInput, Button } from 'flowbite-react'
import Link from 'next/link'
import { useState } from 'react'
import { ApiDeleteTopicResponse, ApiEditTopicResponse } from '../types/api/topic'

interface TopicCardProps {
	id: string
	text: string
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
	reloadTopics: () => void
	reloadSubject: () => void
}

const TopicCard: React.FC<TopicCardProps> = ({ id, text, setErrorMessage, reloadTopics, reloadSubject }) => {
	const [newText, setNewText] = useState(text)
	const [isEditing, setIsEditing] = useState(false)

	const deleteHandler: React.MouseEventHandler<HTMLButtonElement> = async (_) => {
		const res = await fetch(`/api/topic/${id}`, {
			method: 'DELETE',
		})

		const data: ApiDeleteTopicResponse = await res.json()
		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		reloadTopics()
		reloadSubject()
	}

	const confirmEditHandler: React.MouseEventHandler<HTMLButtonElement> = async (_) => {
		if (text == newText) {
			setIsEditing(false)
			return
		}

		const res = await fetch(`/api/topic/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				newText,
			}),
		})

		const data: ApiEditTopicResponse = await res.json()

		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		setIsEditing(false)

		reloadTopics()
	}

	const cancelEditHandler: React.MouseEventHandler<HTMLButtonElement> = (_) => {
		// reset
		setIsEditing(false)
		setNewText(text)
	}

	return (
		<li className="border border-black rounded p-5 transition-colors duration-150 hover:bg-slate-200">
			<div
				className={classNames({
					hidden: isEditing,
				})}
			>
				<Link href={`/topic/${id}`} passHref>
					<a className="text-blue-700 underline">{text}</a>
				</Link>
			</div>

			<div
				className={classNames({
					hidden: !isEditing,
				})}
			>
				<TextInput value={newText} onChange={(e) => setNewText(e.target.value)} required />
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
					onClick={deleteHandler}
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

export default TopicCard
