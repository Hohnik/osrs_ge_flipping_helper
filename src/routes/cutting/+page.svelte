<script>
	import RefreshButton from '$lib/components/RefreshButton.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import CollapsibleItem from "$lib/components/CollapsibleItem.svelte";
	import { sortByProfitFlat } from '$lib/helpers.js';

	let { data, form } = $props();
	let loading = $state(false);
	let error = $state(null);

	$effect(() => {
		if (form?.error) {
			error = form.error;
		}
	});
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

		<!-- Refresh Button -->
		<div class="mb-6">
			<RefreshButton bind:loading />
		</div>

		<ErrorAlert message={error} />

		{#await data.streamed.gemPrices}
			<LoadingSkeleton />
		{:then result}
			{#if result.error}
				<ErrorAlert message={result.error} />
			{:else}
				<div class="space-y-2">
					{#each sortByProfitFlat(result) as gem (gem.uncutId)}
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
			{/if}
		{:catch error}
			<ErrorAlert message={`Failed to load prices: ${error.message}`} />
		{/await}
	</div>
</div>
