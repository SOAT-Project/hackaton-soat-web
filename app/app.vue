<script lang="ts" setup>
useSeoMeta({
	title: "FIAP X - Processador de Vídeos",
	description:
		"Faça upload de vídeos e receba um ZIP com todos os frames extraídos.",
});

const { fetchUser, handleCallback } = useCognitoAuth();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
	if (route.query.code && route.query.state) {
		await handleCallback();
		router.replace({ query: {} });

		return;
	}

	await fetchUser();
});
</script>

<template>
	<UApp>
		<NuxtLayout>
			<UMain class="relative">
				<Header />
				<NuxtPage />
			</UMain>
		</NuxtLayout>
	</UApp>
</template>
