import { createRefreshAction } from '$lib/serverActions.js';
import { fetchHerbPrices } from "$lib/herbsApi.js";

export const actions = createRefreshAction(fetchHerbPrices);
