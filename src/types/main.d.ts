export interface WatchHistoryItem {
	header: string,
	title: string,
	titleUrl: string,
	time: string,
	products: [string],
	activityControls: [string]
}

export interface SimpMeterResult {
	channel: string;
	viewCount: number;
	url: string;
	avatar: string;
}

export interface SimpMeterState {
	file: File | null;
	json: WatchHistoryItem[] | null;
	time: string;
	amount: number;
	loading: boolean;
	firstDate: string;
	lastDate: string;
}