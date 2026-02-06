export default defineAppConfig({
	ui: {
		colors: {
			primary: "blue",
			secondary: "purple",
			neutral: "zinc",
		},
		card: {
			slots: {
				root: "rounded-lg overflow-hidden",
				header: "p-4 sm:px-6",
				body: "p-4 sm:p-6 w-full",
				footer: "p-4 sm:px-6",
			},
		},
	},
});
