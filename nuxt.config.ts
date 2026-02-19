// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",

	devtools: { enabled: true },

	modules: [
		"@nuxt/icon",
		"@nuxt/ui",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"motion-v/nuxt",
		"@formkit/auto-animate/nuxt",
		"@morev/vue-transitions/nuxt",
	],

	css: ["~/assets/css/main.css"],

	runtimeConfig: {
		public: {
			COGNITO_CLIENT_ID: process.env.NUXT_COGNITO_CLIENT_ID || "",
			COGNITO_REGION: process.env.NUXT_COGNITO_REGION || "",
			COGNITO_AUTHORITY: process.env.NUXT_COGNITO_AUTHORITY || "",
			COGNITO_REDIRECT_URI: process.env.NUXT_COGNITO_REDIRECT_URI || "",
			AMBIENT: process.env.NUXT_AMBIENT || "test",
			API_BASE_URL: process.env.NUXT_API_BASE_URL || "",
		},
	},

	ssr: true,

	nitro: {
		preset: "static",
	},

	components: true,
});
