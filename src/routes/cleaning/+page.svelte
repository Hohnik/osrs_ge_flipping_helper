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
	<title>Herb Cleaning - OSRS Trade</title>
</svelte:head>

<div class="min-h-screen bg-base-100 py-8 px-4">
	<div class="container mx-auto max-w-3xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2">Herb Cleaning</h1>
			<p class="text-base-content/70">Clean grimy herbs for profit</p>
		</div>

		<!-- Refresh Button -->
		<div class="mb-6">
			<RefreshButton bind:loading />
		</div>

		<ErrorAlert message={error} />

		{#await data.streamed.herbPrices}
			<LoadingSkeleton />
		{:then result}
			{#if result.error}
				<ErrorAlert message={result.error} />
			{:else}
				<div class="space-y-2">
					{#each sortByProfitFlat(result) as herb (herb.grimyId)}
						<CollapsibleItem
							title={herb.name}
							subtitle="Lvl {herb.level}"
							mainPrice={herb.grimyPrice}
							secondaryPrice={herb.cleanPrice}
							volume={herb.avgVolume}
							profit={herb.profit}
							profitFlat={herb.profitFlat}
						>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-4">
									<div class="bg-base-100 rounded p-3 border border-base-300">
										<div class="text-xs opacity-70 mb-1">Grimy Price</div>
										<div class="text-lg font-bold text-primary">
											{herb.grimyPrice.toLocaleString()}
										</div>
										{#if herb.grimyVolume > 0}
											<div class="text-xs opacity-70 mt-2">
												{Math.round(herb.grimyVolume).toLocaleString()} vol/h
											</div>
										{/if}
									</div>

									<div class="bg-base-100 rounded p-3 border border-base-300">
										<div class="text-xs opacity-70 mb-1">Clean Price</div>
										<div class="text-lg font-bold text-secondary">
											{herb.cleanPrice.toLocaleString()}
										</div>
										{#if herb.cleanVolume > 0}
											<div class="text-xs opacity-70 mt-2">
												{Math.round(herb.cleanVolume).toLocaleString()} vol/h
											</div>
										{/if}
									</div>
								</div>

								<div class="bg-primary/10 rounded p-3">
									<div class="text-xs opacity-70 mb-1">Profit Per Herb</div>
									<div class="text-2xl font-bold text-primary">
										{(herb.cleanPrice * 0.98 - herb.grimyPrice).toLocaleString()} gp
									</div>
									{#if herb.profit !== null}
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
