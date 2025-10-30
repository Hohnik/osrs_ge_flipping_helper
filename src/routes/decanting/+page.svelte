<script>
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import { fetchPotionPrices } from "$lib/potionsApi.js";
	import CollapsibleItem from "$lib/components/CollapsibleItem.svelte";

	let { data, form } = $props();
	let potionPrices = $state(data.potionPrices || {});
	let loading = $state(false);
	let error = $state(data.error || null);
	let isInitialLoad = $state(true);

	onMount(async () => {
		try {
			const prices = await fetchPotionPrices(data.potions);
			potionPrices = prices;
			isInitialLoad = false;
		} catch (err) {
			error = err.message;
			isInitialLoad = false;
		}
	});

	$effect(() => {
		if (form?.success && form?.potionPrices) {
			potionPrices = form.potionPrices;
			isInitialLoad = false;
		} else if (form?.error) {
			error = form.error;
			isInitialLoad = false;
		}
	});

	function getMaxProfit(potion) {
		let maxProfit = -Infinity;
		for (let dose = 1; dose <= 4; dose++) {
			const profit = potionPrices[potion]?.[dose]?.decantProfit;
			if (profit !== null && profit !== undefined) {
				maxProfit = Math.max(maxProfit, profit);
			}
		}
		return maxProfit === -Infinity ? null : maxProfit;
	}

	function getMaxProfitFlat(potion) {
		let maxProfit = -Infinity;
		for (let dose = 1; dose <= 4; dose++) {
			const profit = potionPrices[potion]?.[dose]?.decantProfitFlat;
			if (profit !== null && profit !== undefined) {
				maxProfit = Math.max(maxProfit, profit);
			}
		}
		return maxProfit === -Infinity ? null : maxProfit;
	}


	function getAllVolumes() {
		const volumes = [];
		for (const potion of data.potions || []) {
			if (potionPrices[potion]?.avgVolume) {
				volumes.push(potionPrices[potion].avgVolume);
			}
		}
		return volumes;
	}

	function sortedPotions() {
		return (data.potions || []).sort((a, b) => {
			const profitA = getMaxProfitFlat(a) || -Infinity;
			const profitB = getMaxProfitFlat(b) || -Infinity;
			return profitB - profitA;
		});
	}
</script>

<svelte:head>
	<title>Decanting - OSRS Trade</title>
</svelte:head>

<div class="min-h-screen bg-base-100 py-8 px-4">
	<div class="container mx-auto max-w-2xl">
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2">Potion Decanting</h1>
			<p class="text-base-content/70">Flip potions for profit</p>
		</div>

		{#if error}
			<div class="alert alert-error mb-6">
				<span>{error}</span>
			</div>
		{/if}

		<div class="mb-6">
			<form method="POST" action="?/refresh" use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}>
				<button
					type="submit"
					class="btn btn-primary gap-2"
					disabled={loading}
				>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					{loading ? "Refreshing..." : "Refresh Prices"}
				</button>
			</form>
		</div>

		{#if isInitialLoad && !error}
			<div class="space-y-2">
				{#each Array(8) as _}
					<div class="collapse collapse-arrow border-2 bg-base-200 border-base-300 animate-pulse">
						<input type="checkbox" disabled />
						<div class="collapse-title font-semibold flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="h-4 bg-base-300 rounded w-32"></div>
								<div class="h-4 bg-base-300 rounded w-24"></div>
							</div>
							<div class="h-6 bg-base-300 rounded w-16"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if Object.keys(potionPrices).length > 0}
			<div class="space-y-2">
				{#each sortedPotions() as potion (potion)}
					{@const maxProfit = getMaxProfit(potion)}
					{@const maxProfitFlat = getMaxProfitFlat(potion)}
					<CollapsibleItem
						title={potion}
						mainPrice={potionPrices[potion]?.[1]?.high}
						secondaryPrice={potionPrices[potion]?.[4]?.low}
						volume={potionPrices[potion]?.avgVolume}
						profit={maxProfit}
						profitFlat={maxProfitFlat}
					>
						<div class="overflow-x-auto">
							<table class="table table-sm">
								<thead>
									<tr>
										<th>Dose</th>
										<th>Buy</th>
										<th>Sell</th>
										<th>Per Dose</th>
										<th>Profit (gp)</th>
										<th>Profit (%)</th>
									</tr>
								</thead>
								<tbody>
									{#each [1, 2, 3, 4] as dose (dose)}
										{@const doseData = potionPrices[potion]?.[dose]}
										<tr>
											<td>{dose}</td>
											<td>
												{#if doseData?.high}
													{doseData.high.toLocaleString()}
												{:else}
													-
												{/if}
											</td>
											<td>
												{#if doseData?.low}
													{doseData.low.toLocaleString()}
												{:else}
													-
												{/if}
											</td>
											<td>
												{#if doseData?.pricePerDose}
													{doseData.pricePerDose.toLocaleString(undefined, { maximumFractionDigits: 0 })}
												{:else}
													-
												{/if}
											</td>
											<td>
												{#if doseData?.decantProfitFlat !== null && doseData?.decantProfitFlat !== undefined}
													<span class={doseData.decantProfitFlat >= 0 ? 'text-success font-semibold' : 'text-error font-semibold'}>
														{doseData.decantProfitFlat > 0 ? "+" : ""}{Math.round(doseData.decantProfitFlat).toLocaleString()}
													</span>
												{:else}
													-
												{/if}
											</td>
											<td>
												{#if doseData?.decantProfit !== null && doseData?.decantProfit !== undefined}
													<span class={doseData.decantProfit >= 0 ? 'text-success font-semibold' : 'text-error font-semibold'}>
														{doseData.decantProfit > 0 ? "+" : ""}{doseData.decantProfit.toFixed(1)}%
													</span>
												{:else}
													-
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</CollapsibleItem>
				{/each}
			</div>
		{:else if !loading && !error}
			<div class="alert alert-info">
				<span>No price data loaded. Click "Refresh Prices" to fetch data.</span>
			</div>
		{/if}
	</div>
</div>

