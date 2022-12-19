<script setup lang="ts">
import { switchSelect } from '../backend/history';
import { getGlobalThis } from '@vue/shared';
import { SimpMeterResult, SimpMeterState } from '../types/main';

let app: SimpMeterState = getGlobalThis();

let { result } = defineProps<{
	result: SimpMeterResult[];
}>();
</script>

<template>
	<div class="my-1">
		<h2 class="text-2xl font-bold text-white pb-5">
			Top&nbsp;
			<select id="amount" @change="async($event) => result = await switchSelect($event, app)" style="border: 1px solid #fff; background-color: transparent;">
				<option value=5 style="background-color: #82caff;" >5</option>
				<option value=10 style="background-color: #82caff;" selected="true">10</option>
				<option value=15 style="background-color: #82caff;" >15</option>
			</select>&nbsp;
			most watched channels&nbsp;
			<select id="time" @change="async($event) => result = await switchSelect($event, app)" style="border: 1px solid #fff; background-color: transparent;">
				<option value="week" style="background-color: #82caff;" >in the last week:</option>
				<option value="month" style="background-color: #82caff;" selected="true" >in the last month:</option>
				<option value="year" style="background-color: #82caff;" >in the last year:</option>
				<option value="all" style="background-color: #82caff;" >of all time:</option>
			</select>
		</h2>
		<h3>
			Displaying history from <code>{{ app.firstDate }}</code> to <code>{{ app.lastDate }}</code>.
		</h3>
		<table class="table w-full">
			<thead>
				<tr>
					<th class="text-xl text-white">Channel</th>
					<th class="text-xl text-white">Videos</th>
					<th class="text-xl text-white">Simp Level</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="data in result" :key="data.channel">
					<v-progress-circular
						v-if="app.loading"
						indeterminate
						color="teal"
						:size="60"
						:width="5"
					></v-progress-circular>
					<td class="flex items-center hover:bg-gray-700">
						<img :src="data.avatar" class="w-12 h-12 rounded-full mr-2" />
						<a :href="data.url" target="_blank" style="display: block; width:100%;">{{ data.channel }}</a>
						<v-tooltip
							activator="parent"
							location="top"
							:content-class="['bg-black', 'text-white']"
							> Watched {{ data.viewCount }} {{ data.channel }} videos!
						</v-tooltip>
					</td>
					<td>
						<v-progress-circular
							:size="50"
							:width="5"
							:model-value="data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100"
							:color="data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 50 ? 'red' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 25 ? 'orange' : 'green'"
							>{{ data.viewCount }}
						</v-progress-circular>
					</td>
					<td>
						<v-chip
							:color="data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 90 ? 'red' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 80 ? 'orange' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 70 ? 'yellow' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 60 ? 'lime' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 50 ? 'green' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 40 ? 'cyan' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 30 ? 'blue' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 20 ? 'indigo' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 10 ? 'purple' : 'violet'"
							:text-color="data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 90 ? 'red' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 80 ? 'orange' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 70 ? 'yellow' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 60 ? 'lime' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 50 ? 'green' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 40 ? 'cyan' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 30 ? 'blue' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 20 ? 'indigo' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 10 ? 'purple' : 'violet'"
							>{{ data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 90 ? 'Maximum Simp' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 80 ? 'Ultra Simp' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 70 ? 'Giga Simp' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 60 ? 'Mega Simp' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 50 ? 'Super Simp' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 40 ? 'Advanced Simp' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 30 ? 'Simp' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 20 ? 'Slightly Simp' : data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100 > 10 ? 'Barely Simp' : 'Not Simp' }}
							<v-tooltip
								activator="parent"
								location="bottom"
								:content-class="['bg-black', 'text-white']"
								> {{ (data.viewCount / result.reduce((a, b) => a + b.viewCount, 0) * 100).toFixed(2) }}% Simp
							</v-tooltip>
						</v-chip>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
