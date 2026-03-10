<script lang="ts" setup>
import type {
	DonwloadFileResponse,
	VideoResponse,
} from "~/interface/response.interface";

const props = defineProps<{
	file: VideoResponse;
	showRemoveButton?: boolean;
	availableToDownload?: boolean;
	processing?: boolean;
}>();

defineEmits<{
	(remove: "remove", file: VideoResponse): void;
}>();

const timer = ref<number>(0);
const loading = ref(false);
const currentIconIndex = ref(0);

onMounted(() => {
	if (props.processing) {
		timer.value = window.setInterval(() => {
			currentIconIndex.value = currentIconIndex.value + 1;
		}, 1000);
	}
});

onUnmounted(() => {
	if (timer.value) {
		clearInterval(timer.value);
	}
});

const toast = useToast();

const download = async (file: VideoResponse) => {
	if (loading.value) return;

	try {
		loading.value = true;

		const response = await fetch(
			`${useRuntimeConfig().public.API_BASE_URL}/videos/${file.processId}/download`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${useCognitoAuth().idToken.value}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error(
				`Erro ao solicitar o download do arquivo processado. Status: ${response.status}`,
			);
		}

		const data = await response.json();
		const s3Url = data.downloadUrl;

		const fileResponse = await fetch(s3Url);

		if (!fileResponse.ok) {
			new Error(
				`Erro ao baixar o arquivo do S3. Status: ${fileResponse.status}`,
			);
		}

		const blob = await fileResponse.blob();
		const blobUrl = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = blobUrl;

		const name = data.fileName || "processado";
		link.download = name.endsWith(".zip") ? name : `${name}.zip`;

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		window.URL.revokeObjectURL(blobUrl);

		toast.add({
			title: "Download finalizado",
			description: `O download do arquivo "${file.videoName}" foi finalizado.`,
			color: "success",
		});
		loading.value = false;
	} catch (error: any) {
		toast.add({
			title: "Erro no download",
			description:
				error.message ||
				"Ocorreu um erro ao tentar baixar o arquivo processado.",
			color: "error",
		});
		loading.value = false;
	}
};
</script>

<template>
	<div
		:key="file.videoName"
		class="relative text-xs px-2.5 py-1.5 gap-1.5 min-w-0 flex items-center border border-default rounded-md w-full"
	>
		<span
			class="inline-flex items-center justify-center select-none rounded-full align-middle bg-elevated size-8 text-base shrink-0"
			v-auto-animate
		>
			<UIcon
				name="i-lucide-file-up"
				:key="currentIconIndex"
				class="size-5 text-muted shrink-0"
				v-if="processing"
			/>
			<UIcon
				name="i-lucide-file"
				class="size-5 text-muted shrink-0"
				v-else
			/>
		</span>
		<div class="flex flex-col min-w-0">
			<span class="text-default truncate"
				>{{ file.videoName }}
				<span
					class="text-muted truncate"
					v-if="processing"
					v-auto-animate
				>
					- Processando{{ ".".repeat((currentIconIndex % 3) + 1) }}
				</span>
			</span>
			<span
				class="text-muted truncate"
				v-if="!processing && file.fileSize"
				>{{ formatByteSize(file.fileSize) }}</span
			>
			<span
				class="text-muted truncate"
				v-if="!processing && file.status === 'FAILURE'"
			>
				O processamento do arquivo falhou :(
			</span>
		</div>
		<button
			class="cursor-pointer rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors text-sm gap-1.5 text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted p-1.5 ms-auto -me-1.5"
			@click="$emit('remove', file)"
			v-if="showRemoveButton"
		>
			<UIcon name="i-lucide:x" class="shrink-0 size-5" />
		</button>
		<button
			class="cursor-pointer rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors text-sm gap-1.5 text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted p-1.5 ms-auto -me-1.5"
			@click="download(file)"
			:disabled="loading"
			v-if="
				availableToDownload && !processing && file.status !== 'FAILURE'
			"
		>
			<UIcon
				v-if="!loading"
				name="i-lucide:download"
				class="shrink-0 size-5"
			/>
			<UIcon v-else name="i-lucide:loader" class="shrink-0 size-5" />
		</button>
	</div>
</template>
