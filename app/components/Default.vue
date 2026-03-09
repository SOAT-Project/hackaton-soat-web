<script lang="ts" setup>
import {
	VideoStatus,
	type ListVideosResponse,
	type VideoResponse,
} from "~/interface/response.interface";

const { isAuthenticated, idToken, user } = useCognitoAuth();
const toast = useToast();
const config = useRuntimeConfig();

const processingFiles = ref<VideoResponse[]>([]);
const processedFiles = ref<VideoResponse[]>([]);

const fetchVideos = async () => {
	const userId = user.value?.profile?.sub ?? "";

	try {
		const response = await fetch(
			`${config.public.API_BASE_URL}/videos?userId=${encodeURIComponent(userId)}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${idToken.value}`,
				},
			},
		);
		if (!response.ok) {
			toast.add({
				title: "Erro ao buscar vídeos em processamento",
				description:
					"Ocorreu um erro ao buscar os vídeos em processamento.",
				color: "error",
			});
			return;
		}

		const data: ListVideosResponse = await response.json();

		processingFiles.value = data?.videos
			?.filter((video) => video.status === VideoStatus.PENDING)
			?.sort(
				(a, b) =>
					new Date(b.processedAt).getTime() -
					new Date(a.processedAt).getTime(),
			);

		processedFiles.value = data?.videos
			?.filter((video) =>
				[VideoStatus.PROCESSED, VideoStatus.FAILURE].includes(
					video.status,
				),
			)
			?.sort(
				(a, b) =>
					new Date(b.processedAt).getTime() -
					new Date(a.processedAt).getTime(),
			);

		if (processingFiles.value?.length === 0 && interval.value) {
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

const pollingFetchProcessingVideos = async () => {
	await fetchVideos();

	if (processingFiles.value.length === 0) return;

	interval.value = setInterval(fetchVideos, 20000);
};

watch(
	isAuthenticated,
	async (newValue) => {
		if (newValue) {
			await pollingFetchProcessingVideos();
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
		<FileForm @submit="pollingFetchProcessingVideos()" />

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
