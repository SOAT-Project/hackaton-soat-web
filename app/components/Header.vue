<script setup lang="ts">
import { useCognitoAuth } from "~/composables/useCognitoAuth";
const { user, isAuthenticated, logout } = useCognitoAuth();
</script>

<template>
	<div
		class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10"
	>
		<UNavigationMenu
			variant="link"
			color="neutral"
			class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
			:ui="{
				link: 'px-2 py-1',
				linkLeadingIcon: 'hidden',
			}"
		>
			<template #list-trailing>
				<UPopover
					v-if="isAuthenticated"
					placement="bottom-end"
					class="border-0"
				>
					<UButton
						variant="ghost"
						color="neutral"
						class="cursor-pointer"
					>
						<UIcon class="" name="i-lucide-user" size="sm" />
					</UButton>
					<template #content>
						<UButton @click="logout">Sair</UButton>
					</template>
				</UPopover>
				<ColorModeButton class="cursor-pointer" />
			</template>
		</UNavigationMenu>
	</div>
</template>
