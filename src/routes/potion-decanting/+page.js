import { createPageLoadWithStatic } from '$lib/loadFunctions.js';
import { fetchPotionPrices } from "$lib/potionsApi.js";

const POTIONS = [
	"Prayer potion",
	"Saradomin brew",
	"Super restore",
	"Stamina potion",
	"Super combat potion",
	"Ranging potion"
];

export const load = createPageLoadWithStatic(fetchPotionPrices, {
	dataKey: 'potionPrices',
	potions: POTIONS
});
