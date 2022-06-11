import { PencilIcon, TrashIcon, CheckIcon, XIcon, EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { TextInput, Button, Textarea, Label } from 'flowbite-react'
import Link from 'next/link'
import { useState } from 'react'
import { ApiDeleteQuestionResponse, ApiEditQuestionResponse } from '../types/api/question'

interface QuestionCardProps {
	id: string
	text: string
	answer: string
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
	reloadQuestions: () => void
	reloadTopic: () => void
}

const QuestionCard: React.FC<QuestionCardProps> = ({
	id,
	text,
	answer,
	setErrorMessage,
	reloadQuestions,
	reloadTopic,
}) => {
	const [newText, setNewText] = useState(text)
	const [isEditing, setIsEditing] = useState(false)
	const [newAnswer, setNewAnswer] = useState(answer)
	const [isViewingAnswer, setIsViewingAnswer] = useState(false)

	const deleteHandler: React.MouseEventHandler<HTMLButtonElement> = async (_) => {
		const res = await fetch(`/api/question/${id}`, {
			method: 'DELETE',
		})

		const data: ApiDeleteQuestionResponse = await res.json()
		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		reloadQuestions()
		reloadTopic()
	}

	const confirmEditHandler: React.MouseEventHandler<HTMLButtonElement> = async (_) => {
		if (newText == text && newAnswer == answer) {
			setIsEditing(false)
			return
		}

		const res = await fetch(`/api/question/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				newText,
				newAnswer,
			}),
		})

		const data: ApiEditQuestionResponse = await res.json()

		if (data.ok) {
			setErrorMessage('')
		} else {
			setErrorMessage('An unknown error occured')
		}

		setIsEditing(false)

		reloadQuestions()
	}

	const cancelEditHandler: React.MouseEventHandler<HTMLButtonElement> = (_) => {
		// reset
		setIsEditing(false)
		setNewText(text)
		setNewAnswer(answer)
	}

	return (
		<li className="border border-black rounded p-5 transition-colors duration-150 hover:bg-slate-200">
			<div
				className={classNames({
					hidden: isEditing,
				})}
			>
				<div className="mb-3">{text}</div>

				<div
					className={classNames({
						hidden: !isViewingAnswer,
					})}
				>
					Answer: {answer}
				</div>
			</div>

			<div
				className={classNames({
					hidden: !isEditing,
				})}
			>
				<div>
					<Label className="mb-2">Question</Label>
					<TextInput value={newText} onChange={(e) => setNewText(e.target.value)} required />
				</div>

				<div>
					<Label className="mb-2">Answer</Label>
					<Textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} rows={4} required />
				</div>
			</div>

			<div className="mt-3 flex gap-1">
				<Button
					size="xs"
					outline
					icon={!isViewingAnswer ? EyeIcon : EyeOffIcon}
					color="green"
					onClick={() => setIsViewingAnswer(!isViewingAnswer)}
					className={classNames({
						hidden: isEditing,
					})}
				/>

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

export default QuestionCard
