import { createPageLoadWithStatic } from '$lib/loadFunctions.js';
import { fetchHerbPrices } from '$lib/herbsApi.js';

export const load = createPageLoadWithStatic(fetchHerbPrices, {
	dataKey: 'herbPrices'
});
