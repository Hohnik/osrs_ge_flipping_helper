import { fetchPotionPrices } from "$lib/potionsApi.js";

const POTIONS = [
	"Super combat potion",
	"Prayer potion",
	"Stamina potion",
	"Saradomin brew",
	"Super restore",
	"Super antifire potion",
	"Extended antifire",
	"Anti-venom+"
];

export const actions = {
	refresh: async () => {
		try {
			const potionPrices = await fetchPotionPrices(POTIONS);
			return {
				potionPrices,
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
