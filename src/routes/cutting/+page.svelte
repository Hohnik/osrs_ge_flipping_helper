<script>
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import { fetchGemPrices } from "$lib/gemsApi.js";
	import CollapsibleItem from "$lib/components/CollapsibleItem.svelte";

	let { data, form } = $props();
	let gemPrices = $state(data.gemPrices || {});
	let loading = $state(false);
	let error = $state(data.error || null);
	let isInitialLoad = $state(true);

	onMount(async () => {
		// Fetch data on component mount
		try {
			const prices = await fetchGemPrices();
			gemPrices = prices;
			isInitialLoad = false;
		} catch (err) {
			error = err.message;
			isInitialLoad = false;
		}
	});

	$effect(() => {
		if (form?.success && form?.gemPrices) {
			gemPrices = form.gemPrices;
			isInitialLoad = false;
		} else if (form?.error) {
			error = form.error;
			isInitialLoad = false;
		}
	});

	function getMaxProfit() {
		let maxProfit = -Infinity;
		for (const gem of Object.values(gemPrices)) {
			if (gem.profit !== null && gem.profit !== undefined) {
				maxProfit = Math.max(maxProfit, gem.profit);
			}
		}
		return maxProfit === -Infinity ? null : maxProfit;
	}


	function getAllVolumes() {
		return Object.values(gemPrices)
			.map(g => g.avgVolume)
			.filter(v => v > 0);
	}

	function sortedGems() {
		return Object.values(gemPrices).sort((a, b) => (b.profitFlat || -Infinity) - (a.profitFlat || -Infinity));
	}
</script>

<svelte:head>
	<title>Gem Cutting - OSRS Trade</title>
</svelte:head>

<div class="min-h-screen bg-base-100 py-8 px-4">
	<div class="container mx-auto max-w-3xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2">Gem Cutting</h1>
			<p class="text-base-content/70">Cut gems for profit</p>
		</div>

		{#if error}
			<div class="alert alert-error mb-6">
				<span>{error}</span>
			</div>
		{/if}

		<!-- Refresh Button -->
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

		<!-- Loading Skeleton -->
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
		{:else if Object.keys(gemPrices).length > 0}
			<div class="space-y-2">
				{#each sortedGems() as gem (gem.uncutId)}
					<CollapsibleItem
						title={gem.name}
						subtitle="Lvl {gem.level}"
						mainPrice={gem.uncutPrice}
						secondaryPrice={gem.cutPrice}
						volume={gem.avgVolume}
						profit={gem.profit}
						profitFlat={gem.profitFlat}
					>
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-4">
								<div class="bg-base-100 rounded p-3 border border-base-300">
									<div class="text-xs opacity-70 mb-1">Uncut Price</div>
									<div class="text-lg font-bold text-primary">
										{gem.uncutPrice.toLocaleString()}
									</div>
									{#if gem.uncutVolume > 0}
										<div class="text-xs opacity-70 mt-2">
											{Math.round(gem.uncutVolume).toLocaleString()} vol/h
										</div>
									{/if}
								</div>

								<div class="bg-base-100 rounded p-3 border border-base-300">
									<div class="text-xs opacity-70 mb-1">Cut Price</div>
									<div class="text-lg font-bold text-secondary">
										{gem.cutPrice.toLocaleString()}
									</div>
									{#if gem.cutVolume > 0}
										<div class="text-xs opacity-70 mt-2">
											{Math.round(gem.cutVolume).toLocaleString()} vol/h
										</div>
									{/if}
								</div>
							</div>

							<div class="bg-primary/10 rounded p-3">
								<div class="text-xs opacity-70 mb-1">Profit Per Gem</div>
								<div class="text-2xl font-bold text-primary">
									{(gem.cutPrice * 0.98 - gem.uncutPrice).toLocaleString()} gp
								</div>
								{#if gem.profit !== null}
									<div class="text-xs opacity-70 mt-1">
										After 2% GE tax
									</div>
								{/if}
							</div>
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
