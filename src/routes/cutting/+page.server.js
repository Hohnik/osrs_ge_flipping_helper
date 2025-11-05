import { createRefreshAction } from '$lib/serverActions.js';
import { fetchGemPrices } from '$lib/gemsApi.js';

export const actions = createRefreshAction(fetchGemPrices);
