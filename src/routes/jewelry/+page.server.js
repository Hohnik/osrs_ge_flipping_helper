import { fetchJewelryProfits } from '$lib/jewelryApi.js';

export async function load() {
	try {
		const jewelryData = await fetchJewelryProfits();
		return {
			jewelryData,
			title: 'Jewelry Crafting'
		};
	} catch (error) {
		return {
			error: error.message,
			jewelryData: {}
		};
	}
}

export const actions = {
	refresh: async () => {
		try {
			const jewelryData = await fetchJewelryProfits();
			return {
				success: true,
				jewelryData
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			};
		}
	}
};
