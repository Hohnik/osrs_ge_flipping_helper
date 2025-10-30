export const prerender = false;
export const ssr = false;

export async function load() {
	// Return immediately without waiting for data
	return {
		herbPrices: {},
		error: null
	};
}
