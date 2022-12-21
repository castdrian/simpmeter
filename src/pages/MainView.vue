<script setup lang="ts">
import { ref } from 'vue';
import { parseWatchHistory,validateFile } from '../backend/history';
import { SimpMeterResult, SimpMeterState } from '../types/main';
import ResultsView from './ResultsView.vue';
import UploadView from './UploadView.vue';

let result = ref<SimpMeterResult[] | null>(null);

async function onUpload(event: Event, app: SimpMeterState) {
	const file: File|null = app.file;
	if (!file) return;

	// validate that file is a .json file
	if (file.type !== 'application/json') {
		alert('Please upload a .json file.');
		return;
	}

	// validate that file is in valid format
	if (!await validateFile(file)) {
		alert('Please upload a valid watch-history.json file.');
		return;
	}

	const reader = new FileReader();
	reader.onload = async (event: any): Promise<void> => {
		console.log('file loaded')
		const json = JSON.parse(event.target.result);
		app.json = json;
		result.value = await parseWatchHistory(json, app);
		if (!result.value) {
			alert('Something went wrong. Please try again.');
		}
	};
	reader.readAsText(file);
}
</script>

<template>
	<section class="flex flex-col items-center justify-center min-h-screen">
		<div class="flex flex-col items-center justify-center w-1/2 h-1/2 rounded-lg">
			<div class="flex flex-col items-center justify-center w-full h-1/2">
				<h2 class="my-8 text-3xl font-bold text-white">Simp-O-Meter</h2>
			</div>
			<div class="flex flex-col items-center justify-center w-full h-1/2">
				<ResultsView v-if="result" :result="result" />
				<UploadView v-else :onUpload="onUpload" />
			</div>
		</div>
	</section>
</template>
