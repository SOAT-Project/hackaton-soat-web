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

const { login, isAuthenticated, idToken, user } = useCognitoAuth();
const toast = useToast();
const emit = defineEmits(["submit"]);
const config = useRuntimeConfig();

async function onSubmit(event: FormSubmitEvent<Schema>) {
	loading.value = true;

	if (!isAuthenticated.value) {
		login();
		loading.value = false;
		return;
	}

	const userId = user.value?.profile?.sub ?? "";

	const uploadPromises = event.data.videoList.map(async (file) => {
		const url = `${config.public.API_UPLOAD_BASE_URL}/videos?userId=${userId}&videoName=${file.name}`;
		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch(url, {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => null);
				const errorText = await res
					.text()
					.catch(() => "Erro desconhecido");

				throw new Error(
					errorData?.message || errorText || `Status: ${res.status}`,
				);
			}

			return await res.json();
		} catch (err) {
			return {
				error: true,
				videoName: file.name,
			};
		}
	});

	Promise.all(uploadPromises)
		.then((results) => {
			const errors = results.filter((r) => r.error);

			if (errors.length > 0) {
				toast.add({
					title: "Erro no upload",
					description: `Ocorreu um erro ao enviar o arquivo "${errors[0].videoName}".`,
					color: "error",
				});
			} else {
				toast.add({
					title: "Sucesso ao fazer o upload",
					description:
						"Seus vídeos foram enviados com sucesso! O processamento pode levar alguns minutos.",
					color: "success",
				});
			}
		})
		.finally(() => {
			emit("submit");
			state.videoList = [];
			loading.value = false;
		});
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
			</UFileUpload>
		</UFormField>

		<div class="flex justify-center my-5">
			<UButton
				type="submit"
				label="Processar Vídeos"
				color="primary"
				class="cursor-pointer"
				:loading="loading"
			/>
		</div>
	</UForm>
</template>
