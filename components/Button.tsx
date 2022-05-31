interface ButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	children: React.ReactNode
}

const Button: React.FC<ButtonProps> = (props) => {
	const { children, className, ...rest } = props

	return (
		<button
			className={`inline-block border border-transparent px-3 py-2 rounded-xl text-center align-middle ease-in-out duration-150 cursor-pointer text-white ${className}`}
			{...rest}
		>
			{props.children}
		</button>
	)
}

export default Button
