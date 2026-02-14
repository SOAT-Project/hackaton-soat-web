<script lang="ts" setup>
import type { FileItem } from "~/interface/file.interface";
import { filesProcessedMock, filesProcessingMock } from "~/mocks/files.mock";

const { isAuthenticated } = useCognitoAuth();
const toast = useToast();
const config = useRuntimeConfig();

const processingFiles = ref<FileItem[]>([]);
const processedFiles = ref<FileItem[]>([]);

const fetchProcessedVideos = async () => {
	try {
		if (config.public.AMBIENT === "dev") {
			processedFiles.value = filesProcessedMock;
			return;
		}

		const response = await fetch("/api/processed-videos");
		const data = await response.json();
		processedFiles.value = data.files;
	} catch (error) {
		toast.add({
			title: "Erro ao buscar vídeos",
			description: "Ocorreu um erro ao buscar os vídeos processados.",
			color: "error",
		});
	}
};

const fetchProcessingVideos = async () => {
	try {
		if (config.public.AMBIENT === "dev") {
			processingFiles.value = filesProcessingMock;
			return;
		}

		const response = await fetch("/api/processing-videos");
		const data = await response.json();
		processingFiles.value = data.files;

		if (processingFiles.value.length === 0 && interval.value) {
			clearInterval(interval.value);
			interval.value = null;
		}
	} catch (error) {
		toast.add({
			title: "Erro ao buscar vídeos em processamento",
			description:
				"Ocorreu um erro ao buscar os vídeos em processamento.",
			color: "error",
		});
	}
};

const interval = ref<ReturnType<typeof setInterval> | null>(null);

const pollingFetchProcessingVideos = () => {
	fetchProcessingVideos();

	if (processingFiles.value.length === 0) {
		return;
	}

	interval.value = setInterval(fetchProcessingVideos, 5000);
};

watch(
	isAuthenticated,
	(newValue) => {
		if (newValue) {
			fetchProcessedVideos();
			pollingFetchProcessingVideos();
		} else {
			processingFiles.value = [];
			processedFiles.value = [];
			if (interval.value) {
				clearInterval(interval.value);
				interval.value = null;
			}
		}
	},
	{ immediate: true },
);

onUnmounted(() => {
	if (interval.value) {
		clearInterval(interval.value);
	}
});
</script>

<template>
	<UCard class="p-6 flex items-center justify-center">
		<FileForm @submit="fetchProcessingVideos" />

		<div v-if="processingFiles?.length" class="mb-5">
			<USeparator vertical class="mb-5" />
			<List
				:files="processingFiles"
				processing
				title="Vídeos em processamento"
			/>
		</div>

		<div v-if="processedFiles?.length">
			<USeparator vertical class="mb-5" v-if="!processingFiles?.length" />
			<List
				:files="processedFiles"
				availableToDownload
				title="Processados"
			/>
		</div>
	</UCard>
</template>
