import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<StyledEngineProvider injectFirst>
			<CssBaseline />
			<Component {...pageProps} />
		</StyledEngineProvider>
	)
}

export default MyApp
