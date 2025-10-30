export const prerender = false;
export const ssr = false;

const POTIONS = [
	"Prayer potion",
	"Saradomin brew",
	"Super restore",
	"Stamina potion",
	"Super combat potion",
	"Ranging potion"
];

export async function load() {
	// Return immediately without waiting for data
	return {
		potionPrices: {},
		potions: POTIONS,
		error: null
	};
}
