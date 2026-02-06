<script lang="ts" setup>
defineProps<{
	file: File;
	showRemoveButton?: boolean;
	inProcessing?: boolean;
}>();

defineEmits<{
	(remove: "remove", file: File): void;
}>();
</script>

<template>
	<div
		:key="file.name"
		class="relative text-xs px-2.5 py-1.5 gap-1.5 min-w-0 flex items-center border border-default rounded-md w-full"
	>
		<span
			class="inline-flex items-center justify-center select-none rounded-full align-middle bg-elevated size-8 text-base shrink-0"
		>
			<UIcon
				v-if="inProcessing"
				name="i-lucide-file-up"
				class="size-5 text-muted shrink-0"
			/>
			<UIcon
				v-else
				name="i-lucide-file"
				class="size-5 text-muted shrink-0"
			/>
		</span>
		<div class="flex flex-col min-w-0">
			<span class="text-default truncate">{{ file.name }}</span>
			<span class="text-muted truncate" v-if="!inProcessing">{{
				formatByteSize(file.size)
			}}</span>
			<span class="text-muted truncate" v-if="inProcessing">
				Processando...
			</span>
		</div>
		<button
			class="rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors text-sm gap-1.5 text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted p-1.5 ms-auto -me-1.5"
			@click="$emit('remove', file)"
			v-if="showRemoveButton"
		>
			<UIcon name="i-lucide:x" class="shrink-0 size-5" />
		</button>
	</div>
</template>
