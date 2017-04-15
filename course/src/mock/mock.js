import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import mockData from "./data"

export default {
	mockApi() {
		let mock = new MockAdapter(axios);

		mock.onGet("/banners").reply(200, {
			banners: mockData.banners
		})

		mock.onGet("/video_list").reply(200, {
			videos: mockData.videoList
		})

		mock.onGet("video_data").reply(200, {
			videos: mockData.videoData
		})
	}
}