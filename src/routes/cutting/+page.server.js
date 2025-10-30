import { fetchGemPrices } from '$lib/gemsApi.js';

export const actions = {
	refresh: async () => {
		try {
			const gemPrices = await fetchGemPrices();
			return {
				success: true,
				gemPrices
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}
};
