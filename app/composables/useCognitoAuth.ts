import { User, UserManager } from "oidc-client-ts";

const user = ref<User | null>(null);
const accessToken = ref<string | null>(null);
const refreshToken = ref<string | null>(null);
const idToken = ref<string | null>(null);
const isAuthenticated = ref(false);

export function useCognitoAuth() {
	const runtimeConfig = useRuntimeConfig();
	const config = {
		authority: String(runtimeConfig.public.COGNITO_AUTHORITY ?? ""),
		client_id: String(runtimeConfig.public.COGNITO_CLIENT_ID ?? ""),
		redirect_uri: String(runtimeConfig.public.COGNITO_REDIRECT_URI ?? ""),
		response_type: "code",
		scope: "openid email phone",
		automaticSilentRenew: true,
		silent_redirect_uri: `${String(runtimeConfig.public.COGNITO_REDIRECT_URI ?? "")}/silent-renew.html`,
		metadata: {
			issuer: String(runtimeConfig.public.COGNITO_AUTHORITY ?? ""),
			authorization_endpoint: `${String(runtimeConfig.public.COGNITO_AUTHORITY ?? "")}/oauth2/authorize`,
			token_endpoint: `${String(runtimeConfig.public.COGNITO_AUTHORITY ?? "")}/oauth2/token`,
			userinfo_endpoint: `${String(runtimeConfig.public.COGNITO_AUTHORITY ?? "")}/oauth2/userInfo`,
			end_session_endpoint: `${String(runtimeConfig.public.COGNITO_AUTHORITY ?? "")}/logout`,
		},
	};

	const userManager = new UserManager(config);

	async function fetchUser() {
		try {
			const currentUser = await userManager.getUser();
			user.value = currentUser;
			accessToken.value = currentUser?.access_token || null;
			refreshToken.value = currentUser?.refresh_token || null;
			idToken.value = currentUser?.id_token || null;
			isAuthenticated.value = !!currentUser && !currentUser.expired;
		} catch (err) {
			throw createError({
				status: 401,
				statusText: "Unauthorized",
				message:
					"Erro ao autenticar com Cognito: " + (err as Error).message,
				data: { fatal: true, unhandled: true },
			});
		}
	}

	function login() {
		try {
			userManager?.signinRedirect({
				extraQueryParams: {
					lang: "pt-BR",
				},
			});
		} catch (err) {
			console.error("Error during login redirect:", err);
		}
	}

	function logout() {
		userManager?.signoutRedirect({
			extraQueryParams: {
				lang: "pt-BR",
			},
		});
	}

	async function handleCallback() {
		const loggedUser = await userManager?.signinCallback();
		console.log("Logged user:", loggedUser);
		user.value = loggedUser ?? null;
		accessToken.value = loggedUser?.access_token || null;
		refreshToken.value = loggedUser?.refresh_token || null;
		idToken.value = loggedUser?.id_token || null;
		isAuthenticated.value = !!loggedUser && !loggedUser?.expired;
		return loggedUser ?? null;
	}

	return {
		login,
		logout,
		handleCallback,
		fetchUser,
		user,
		accessToken,
		refreshToken,
		idToken,
		isAuthenticated,
	};
}
