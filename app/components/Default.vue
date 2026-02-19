<script lang="ts" setup>
import type { FileItem } from "~/interface/file.interface";
import {
	VideoStatus,
	type ListVideosResponse,
	type VideoResponse,
} from "~/interface/response.interface";

const { isAuthenticated, idToken } = useCognitoAuth();
const toast = useToast();
const config = useRuntimeConfig();

const processingFiles = ref<VideoResponse[]>([]);
const processedFiles = ref<VideoResponse[]>([]);

const fetchVideos = async () => {
	try {
		const response = await fetch(
			`${config.public.API_BASE_URL}/processing-videos?userId=${idToken.value}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${idToken.value}`,
				},
			},
		);
		const data: ListVideosResponse = await response.json();
		processingFiles.value = data?.videos?.filter(
			(video) => video.status === VideoStatus.PENDING,
		);
		processedFiles.value = data?.videos?.filter(
			(video) => video.status === VideoStatus.PROCESSED,
		);

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
	fetchVideos();

	if (processingFiles.value.length === 0) {
		return;
	}

	interval.value = setInterval(fetchVideos, 5000);
};

watch(
	isAuthenticated,
	(newValue) => {
		if (newValue) {
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
		<FileForm @submit="fetchVideos" />

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
