<template>
	<div
		class="flex flex-col items-center justify-center min-h-screen bg-muted"
	>
		<UCard class="max-w-md w-full text-center">
			<template #header>
				<span class="text-5xl text-primary">
					<UIcon name="i-lucide-alert-triangle" />
				</span>
			</template>
			<h1 class="text-3xl font-bold mb-2">Ocorreu um erro</h1>
			<p class="mb-4 text-muted-foreground">
				{{ error.statusCode }} -
				{{ error.message || "Algo deu errado." }}
			</p>
			<UButton color="primary" @click="goHome"
				>Voltar para o início</UButton
			>
		</UCard>
	</div>
</template>

<script setup>
const props = defineProps({ error: Object });
const goHome = () => (window.location.href = "/");
</script>
