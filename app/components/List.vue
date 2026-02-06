<script lang="ts" setup>
const {} = useCognitoAuth();
</script>

<template>
	<div>
		<div class="flex justify-center mb-4">
			<h3 class="text-2xl font-bold text-center">Vídeos Processados</h3>
		</div>
		<div class="flex flex-col w-full gap-2">
			<CardItem v-for="file in []" :file="file" />
		</div>
	</div>
</template>
