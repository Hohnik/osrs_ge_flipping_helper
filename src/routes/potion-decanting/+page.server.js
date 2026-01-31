import { createRefreshAction } from '$lib/serverActions.js';
import { fetchPotionPrices } from "$lib/potionsApi.js";

export const actions = createRefreshAction(fetchPotionPrices);
