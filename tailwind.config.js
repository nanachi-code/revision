/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const TailwindConfig = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./node_modules/flowbite-react/**/*.js',
	],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('flowbite/plugin')],
}

module.exports = TailwindConfig
