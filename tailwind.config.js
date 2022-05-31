/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const TailwindConfig = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
	],
}

module.exports = TailwindConfig
