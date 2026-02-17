<script lang="ts" setup>
import type { FileItem } from "~/interface/file.interface";

const props = defineProps<{
	file: FileItem;
	showRemoveButton?: boolean;
	availableToDownload?: boolean;
	processing?: boolean;
}>();

defineEmits<{
	(remove: "remove", file: FileItem): void;
}>();

const timer = ref<number>(0);

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

const { idToken } = useCognitoAuth();

const download = (file: FileItem) => {
	$fetch(`/api/download`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${idToken.value}`,
		},
	})
		.then((response) => {
			const res = response as Response;
			if (!res.ok) {
				throw new Error("Erro ao baixar o arquivo.");
			}
			return res.blob();
		})
		.then((blob) => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = file.file_name;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		})
		.catch((error) => {
			console.error(error);
		});
};
</script>

<template>
	<div
		:key="file.file_name"
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
				>{{ file.file_name }}
				<span
					class="text-muted truncate"
					v-if="processing"
					v-auto-animate
				>
					- Processando{{ ".".repeat((currentIconIndex % 3) + 1) }}
				</span>
			</span>
			<span class="text-muted truncate">{{
				formatByteSize(file.file_size)
			}}</span>
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
			v-if="availableToDownload"
		>
			<UIcon name="i-lucide:download" class="shrink-0 size-5" />
		</button>
	</div>
</template>
