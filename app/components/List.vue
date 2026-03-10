<script lang="ts" setup>
import type { VideoResponse } from "~/interface/response.interface";

const { title, files, availableToDownload, processing } = defineProps<{
	title: string;
	files: VideoResponse[];
	availableToDownload?: boolean;
	processing?: boolean;
}>();
</script>

<template>
	<div>
		<div class="flex justify-center mb-4">
			<h3 class="text-2xl font-bold text-center">{{ title }}</h3>
		</div>
		<div class="flex flex-col w-full gap-2 list">
			<CardItem
				v-for="file in files"
				:file="file"
				:processing="processing"
				:availableToDownload="availableToDownload"
			/>
		</div>
	</div>
</template>

<style scoped>
.list {
	overflow-y: auto;
	max-height: 300px;
}
</style>
