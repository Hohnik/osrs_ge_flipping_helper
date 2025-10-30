import { fetchHerbPrices } from "$lib/herbsApi.js";

export const actions = {
	refresh: async () => {
		try {
			const herbPrices = await fetchHerbPrices();
			return {
				herbPrices,
				success: true
			};
		} catch (error) {
			return {
				error: error.message,
				success: false
			};
		}
	}
};
