import { fetchJewelryProfits } from "$lib/jewelryApi.js";

export async function load() {
	return {
		streamed: {
			jewelryData: fetchJewelryProfits().catch(error => ({
				error: error.message
			}))
		}
	};
}
