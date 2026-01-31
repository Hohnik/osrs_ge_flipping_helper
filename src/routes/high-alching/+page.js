import { fetchAlchPrices } from "$lib/alchingApi.js";

export async function load() {
	return {
		streamed: {
			alchPrices: fetchAlchPrices().catch(error => ({
				error: error.message
			}))
		}
	};
}
