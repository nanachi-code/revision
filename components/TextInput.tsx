interface TextInputProps
	extends React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	label: string
}

const TextInput: React.FC<TextInputProps> = (props) => {
	return (
		<div className="mb-3">
			<label htmlFor={props.id} className="inline-block">
				{props.label}
			</label>
			<input className="rounded block w-full" {...props} />
		</div>
	)
}

export default TextInput
