<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const ACCEPTED_TYPES = [
	"video/mp4",
	"video/avi",
	"video/quicktime",
	"video/x-matroska",
];

const schema = z.object({
	videoList: z
		.array(
			z
				.instanceof(File)
				.refine((file) => ACCEPTED_TYPES.includes(file.type), {
					message:
						"Tipo de arquivo inválido. Por favor, envie um vídeo nos formatos MP4, AVI, MOV ou MKV.",
				}),
		)
		.min(1, { message: "Por favor, envie ao menos um arquivo de vídeo." }),
});

type Schema = z.output<typeof schema>;

const loading = ref(false);

const state = reactive<Partial<Schema>>({
	videoList: [],
});

const removeFile = (file: File) => {
	if (!state.videoList) return;
	state.videoList = state.videoList.filter((f) => f.name !== file.name);
};

const { login, isAuthenticated } = useCognitoAuth();

async function onSubmit(event: FormSubmitEvent<Schema>) {
	console.log(event.data);

	if (!isAuthenticated.value) {
		login();
		loading.value = false;
		return;
	}
}
</script>

<template>
	<UForm :schema="schema" :state="state" @submit="onSubmit" class="">
		<div class="flex justify-center mb-4">
			<h1 class="text-4xl font-bold text-center">
				FIAP X - Processador de Vídeos
			</h1>
		</div>
		<div class="flex justify-center mb-6">
			<h2 class="text-lg text-center max-w-2xl">
				Faça upload de vídeos e receba um ZIP com todos os frames
				extraídos.
			</h2>
		</div>

		<UFormField name="videoList">
			<UFileUpload
				label="Solte ou clique para selecionar seus vídeos aqui"
				description="MP4, AVI, MOV e MKV suportados"
				:disabled="loading"
				v-model="state.videoList"
				layout="list"
				multiple
				highlight
				:interactive="true"
				accept="video/mp4,video/avi,video/quicktime,video/x-matroska"
			>
				<template #files="{ files }">
					<div class="flex flex-col w-full gap-2">
						<CardItem
							v-for="file in files"
							:key="file.name"
							:file="file"
							showRemoveButton
							:inProcessing="loading"
							@remove="removeFile"
						/>
					</div>
				</template>
			</UFileUpload>
		</UFormField>

		<div class="flex justify-center my-5">
			<UButton
				type="submit"
				label="Processar Vídeos"
				color="primary"
				:loading="loading"
			/>
		</div>
	</UForm>
</template>
