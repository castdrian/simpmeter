<script setup lang="ts">
import { getGlobalThis } from '@vue/shared';
import { saveFile } from '../backend/history';
import type { SimpMeterState } from '../types/main';
let app: SimpMeterState = getGlobalThis();

app.time = 'month';
app.amount = 10;
app.json = null;
app.file = null;

const { onUpload } = defineProps<{
	onUpload: (event: Event, app: SimpMeterState) => Promise<void>;
}>();

function openTakeoutTab() {
	window.open('https://takeout.google.com/settings/takeout', '_blank');
}

let isLoading = ref(false);

async function buttonClick($event: any, app: SimpMeterState) {
	isLoading.value = true;
	await onUpload($event, app)
	isLoading.value = false;
}
</script>

<template>
	<div class="flex flex-col items-center justify-center">
		<p class="text-xl text-white">Upload your watch-history.json file to see your watch history.</p> <br />
		<v-row
			align="center"
			justify="center"
			class="space-x-4"
		>
			<v-file-input
				id="file"
				@change="saveFile($event, app)"
				accept=".json"
				label="Upload your watch history"
				:disabled="isLoading"
				:loading="isLoading"
				:rounded="true"
				:outlined="true"
				:color="app.loading ? 'primary' : 'secondary'"
				:placeholder="app.file ? app.file.name : 'No file chosen'"
				style="min-width: 300px"
			></v-file-input>
			<v-btn
				:disabled="isLoading"
				:loading="isLoading"
				color="secondary"
				@click="async($event: any) => await buttonClick($event, app)"
				>Analyze!
			</v-btn>
		</v-row>
		<br />
		<v-btn
			color="primary"
			@click="openTakeoutTab()"
			>Download your watch history
			<v-tooltip
				activator="parent"
				location="bottom"
				:content-class="['bg-black', 'text-white']"
				>- Go to Google Takeout<br />- Click Deselect all<br />
				- Select "YouTube and YouTube Music at the bottom"<br />
				- Click "All YouTube Data Included" and hit Deselect all<br />
				- Select history and click OK<br />
				- Click Multiple Formats and select JSON for History<br />
				- Click Next step and complete the export<br />
			</v-tooltip>
		</v-btn>
	</div>
</template>
