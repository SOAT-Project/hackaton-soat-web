<script lang="ts" setup>
import type { FileItem } from "~/interface/file.interface";

const { title, files, availableToDownload } = defineProps<{
	title: string;
	files: FileItem[];
	availableToDownload?: boolean;
	processing?: boolean;
}>();
</script>

<template>
	<div>
		<div class="flex justify-center mb-4">
			<h3 class="text-2xl font-bold text-center">{{ title }}</h3>
		</div>
		<div class="flex flex-col w-full gap-2">
			<CardItem
				v-for="file in files"
				:file="file"
				:processing="processing"
				:availableToDownload="availableToDownload"
			/>
		</div>
	</div>
</template>
