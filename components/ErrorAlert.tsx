import classNames from 'classnames'
import { Alert } from 'flowbite-react'

interface ErrorAlertProps {
	errorMessage: string
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ errorMessage }) => {
	return (
		<div
			className={classNames({
				hidden: !errorMessage,
			})}
		>
			<Alert color="red">
				<span className="font-medium">{errorMessage}</span>
			</Alert>
		</div>
	)
}

export default ErrorAlert
