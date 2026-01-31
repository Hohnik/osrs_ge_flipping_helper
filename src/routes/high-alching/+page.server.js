import { fetchAlchPrices } from '$lib/alchingApi.js';

export const actions = {
	refresh: async () => {
		try {
			const alchPrices = await fetchAlchPrices();
			return {
				success: true,
				alchPrices
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}
};
