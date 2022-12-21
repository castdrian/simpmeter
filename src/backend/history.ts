import { isAfter, parseISO, sub } from 'date-fns';
import type { SimpMeterResult, SimpMeterState, WatchHistoryItem } from '../types/main';

export async function validateFile(file: File): Promise<boolean> {
	// check if json file is array of watch history items
	const fileText = await file.text();
	const fileJson = JSON.parse(fileText);
	if (Array.isArray(fileJson)) {
		const firstItem = fileJson[0];
		if (firstItem.header && firstItem.title && firstItem.titleUrl && firstItem.subtitles && firstItem.time && firstItem.products && firstItem.activityControls) {
			return true;
		}
	}
	return false;
}

export function saveFile(event: Event, app: any) {
	const fileSelected = (event.target as HTMLInputElement).files?.length;
	if (fileSelected) {
		// save file to state
		app.file = (event.target as HTMLInputElement).files?.[0];
	}
}

export async function switchSelect(event: Event, app: SimpMeterState): Promise<SimpMeterResult[]> {
	app.loading = true;
	const value = (event.target as HTMLSelectElement).selectedOptions[0].value;
	
	// determine if value is a number or a string and parse it accordingly
	const selected = isNaN(parseInt(value)) ? value : parseInt(value);
	// save selected value to state based on type
	if (typeof selected === 'number') {
		app.amount = selected;
	} else {
		app.time = selected;
	}

	return await parseWatchHistory(app.json!, app);
}

async function getChannelAvatar(url: string): Promise<string> {
	const response = await useFetch(url);
	const html = await response.data as unknown as string;
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	
	// get meta tags
	const metaTags = doc.querySelectorAll('meta');
	const metaTagsArray = Array.from(metaTags);
	const metaTagsObject = metaTagsArray.reduce<Record<string,string>>((acc, curr) => {
		// @ts-ignore
		acc[curr.getAttribute('property')] = curr.getAttribute('content');
		return acc;
	}, {});
	
	// get \"og:image\" tag
	const icon = metaTagsObject['\\"og:image\\"'];
	const avatar = icon.replace(/\\\"/g, '');
	return avatar;
}

export async function parseWatchHistory(videos: WatchHistoryItem[], app: SimpMeterState): Promise<SimpMeterResult[]> {
	const filteredVideos: { titleUrl: string, time: Date }[] = [];
	console.log('parsing watch history...');
	for (const video of videos) {
		if (video.products[0] === 'YouTube') {
			const time = parseISO(video.time);
			
			const { titleUrl } = video;

			const data = {
				titleUrl,
				time,
			};
			
			switch (app.time) {
				case 'week':
					if (isAfter(time, sub(parseISO(videos[0].time), { weeks: 1 }))) {
						filteredVideos.push(data);
					}
					break;
				case 'month':
					if (isAfter(time, sub(parseISO(videos[0].time), { months: 1 }))) {
						filteredVideos.push(data);
					}
					break;
				case 'year':
					if (isAfter(time, sub(parseISO(videos[0].time), { years: 1 }))) {
						filteredVideos.push(data);
					}
					break;
				case 'all':
					filteredVideos.push(data);
					break;
			}
		}
	}

	const channels: { channel: string; url: string; avatar: string; time: Date; }[] = [];

	for (const video of filteredVideos) {
		const { channel, url } = await getChannelUrl(video.titleUrl);
		console.log(channel, url);
		const avatar = await getChannelAvatar(url);
		const time = video.time;
	
		const data = {
			channel,
			url,
			avatar,
			time,
		};
		channels.push(data);
	}

	// grab the first and last date based on app.time being all or not
	app.firstDate = app.time === 'all' ? parseISO(videos[videos.length - 1]?.time).toDateString() : channels[channels.length - 1]?.time.toDateString();
	app.lastDate = app.time === 'all' ? parseISO(videos[0].time).toDateString() : channels[0].time.toDateString();

	// count the number of times each channel appears in the array and sort by most appearances
	const counts = channels.reduce((acc, curr) => {
		acc[curr.channel] = (acc[curr.channel] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

	// return the top n channels, their viewCounts, their urls and their avatars based on the amount selected
	const topChannels = sorted.slice(0, app.amount).map(async (channel) => {
		const url = channels.find((c) => c.channel === channel[0])?.url as string;
		const avatar = await getChannelAvatar(url);
		console.log(avatar);
		return {
			channel: channel[0],
			viewCount: channel[1],
			url,
			avatar,
		};
	});

	const results = await Promise.all(topChannels);
	app.loading = false;
	return results;
}

async function getChannelUrl(titleUrl: string): Promise<{ channel: string; url: string; }> {
	const response = await useFetch(titleUrl);
	const html = await response.data as unknown as string;

	
	// find youtube channel url in html like http://www.youtube.com/channel/UCrs-raoLlvf1CE7ZqX7ls2w\
	// js regex to find the channel url
	const regex = /http:\/\/www.youtube.com\/channel\/[a-zA-Z0-9_-]{24}/g;
	const match = html.match(regex);
	console.log(match);

	// get channel name from url
	const { data: res } = await useFetch(match as unknown as string);
	console.log(res);
	const html2 = await res as unknown as string;
	const parser = new DOMParser();
	const doc = parser.parseFromString(html2, 'text/html');
	const channel = doc.querySelector('title')?.textContent?.split(' - ')[0] as string;
	console.log(channel);

	return { channel, url: match as unknown as string };
}

