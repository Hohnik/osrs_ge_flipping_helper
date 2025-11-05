import { createPageLoadWithStatic } from '$lib/loadFunctions.js';
import { fetchGemPrices } from "$lib/gemsApi.js";

export const load = createPageLoadWithStatic(fetchGemPrices, {
	dataKey: 'gemPrices'
});
