<script>
	import RefreshButton from '$lib/components/RefreshButton.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import CollapsibleItem from "$lib/components/CollapsibleItem.svelte";
	import { getMaxProfit, getMaxProfitFlat, sortPotionsByProfit } from '$lib/helpers.js';

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
	<title>Decanting - OSRS Trade</title>
</svelte:head>

<div class="min-h-screen bg-base-100 py-8 px-4">
	<div class="container mx-auto max-w-2xl">
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2">Potion Decanting</h1>
			<p class="text-base-content/70">Flip potions for profit</p>
		</div>

		<div class="mb-6">
			<RefreshButton bind:loading />
		</div>

		<ErrorAlert message={error} />

		{#await data.streamed.potionPrices}
			<LoadingSkeleton />
		{:then result}
			{#if result.error}
				<ErrorAlert message={result.error} />
			{:else}
				<div class="space-y-2">
					{#each sortPotionsByProfit(result, data.potions) as potion (potion)}
						{@const maxProfit = getMaxProfit(result, potion)}
						{@const maxProfitFlat = getMaxProfitFlat(result, potion)}
						<CollapsibleItem
							title={potion}
							mainPrice={result[potion]?.[1]?.high}
							secondaryPrice={result[potion]?.[4]?.low}
							volume={result[potion]?.avgVolume}
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
											{@const doseData = result[potion]?.[dose]}
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
			{/if}
		{:catch error}
			<ErrorAlert message={`Failed to load prices: ${error.message}`} />
		{/await}
	</div>
</div>
