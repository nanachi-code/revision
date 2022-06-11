import Head from 'next/head'
import Link from 'next/link'

interface LayoutProps {
	title?: string
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<div className="text-center">
				<Link href="/" passHref>
					<a>
						<h1 className="text-6xl mb-5 font-bold">Revision</h1>
					</a>
				</Link>
				<p>
					This app helps you memorize things better using a method called{' '}
					<a
						className="text-blue-700 underline"
						href="https://www.osmosis.org/blog/2022/02/21/active-recall-the-most-effective-highyield-learning-technique#:~:text=Active%20recall%20(a.k.a.%20active%20retrieval,retrieving%20information%20from%20your%20brain."
					>
						active recall
					</a>
					.
				</p>
			</div>
			<div className="px-3 pb-5">
				<div className="mt-5">{children}</div>
			</div>
		</>
	)
}

export default Layout
