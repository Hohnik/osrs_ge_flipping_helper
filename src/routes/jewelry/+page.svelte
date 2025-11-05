<script>
	import RefreshButton from '$lib/components/RefreshButton.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import CollapsibleItem from "$lib/components/CollapsibleItem.svelte";

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
	<title>Jewelry Crafting - OSRS Trade</title>
</svelte:head>

<div class="min-h-screen bg-base-100 py-8 px-4">
	<div class="container mx-auto max-w-3xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2">Jewelry Crafting</h1>
			<p class="text-base-content/70">
				Craft jewelry from gems and gold bars for profit
			</p>
		</div>

		<!-- Refresh Button -->
		<div class="mb-6">
			<RefreshButton bind:loading />
		</div>

		<ErrorAlert message={error} />

		<!-- Best Locations Info -->
		<div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="card bg-base-200 border border-base-300">
				<div class="card-body p-4">
					<h3 class="card-title text-sm mb-2">⭐ Best: Edgeville</h3>
					<p class="text-xs text-base-content/70">
						Furnace only 14 squares from bank. Fastest crafting with minimal running.
					</p>
				</div>
			</div>
			<div class="card bg-base-200 border border-base-300">
				<div class="card-body p-4">
					<h3 class="card-title text-sm mb-2">Crafting Guild</h3>
					<p class="text-xs text-base-content/70">
						Level 40+ required. Great for AFK crafting with chisel respawns.
					</p>
				</div>
			</div>
			<div class="card bg-base-200 border border-base-300">
				<div class="card-body p-4">
					<h3 class="card-title text-sm mb-2">Shilo Village</h3>
					<p class="text-xs text-base-content/70">
						Quest required. Bank directly next to furnace. Mine gems nearby.
					</p>
				</div>
			</div>
			<div class="card bg-base-200 border border-base-300">
				<div class="card-body p-4">
					<h3 class="card-title text-sm mb-2">Al Kharid</h3>
					<p class="text-xs text-base-content/70">
						Alternative option, further from bank than Edgeville.
					</p>
				</div>
			</div>
		</div>

		{#await data.streamed.jewelryData}
			<LoadingSkeleton />
		{:then result}
			{#if result.error}
				<ErrorAlert message={result.error} />
			{:else}
				<div class="space-y-4">
					{#each Object.entries(result) as [gemType, gemData] (gemType)}
						<div class="card border-2 border-base-300 bg-base-100">
							<div class="card-body">
								<h2 class="card-title text-lg mb-4">{gemData.gemName}</h2>

								<div class="grid grid-cols-2 gap-4 mb-6">
									<div class="bg-base-200 rounded p-3 border border-base-300">
										<div class="text-xs opacity-70 mb-1">Gem Price</div>
										<div class="text-lg font-bold text-primary">
											{gemData.gemPrice.toLocaleString()}
										</div>
									</div>
									<div class="bg-base-200 rounded p-3 border border-base-300">
										<div class="text-xs opacity-70 mb-1">Gold Bar Cost</div>
										<div class="text-lg font-bold">
											{gemData.goldBarPrice.toLocaleString()}
										</div>
									</div>
								</div>

								<div class="divider my-2"></div>

								<div class="space-y-2">
									{#each gemData.items as item (item.itemId)}
										<CollapsibleItem
											title={item.name}
											mainPrice={gemData.gemPrice}
											secondaryPrice={item.craftedPrice}
											profit={item.profitPct}
											profitFlat={item.profitFlat}
											subtitle={`Level ${item.level}`}
											volume={item.volume}
											borderColor="border-base-300"
										>
											<div class="space-y-4">
												<div class="grid grid-cols-2 gap-4">
													<div class="bg-base-100 rounded p-3 border border-base-300">
														<div class="text-xs opacity-70 mb-1">Gem Cost</div>
														<div class="text-lg font-bold text-primary">
															{gemData.gemPrice.toLocaleString()}
														</div>
													</div>
													<div class="bg-base-100 rounded p-3 border border-base-300">
														<div class="text-xs opacity-70 mb-1">Gold Bar Cost</div>
														<div class="text-lg font-bold">
															{gemData.goldBarPrice.toLocaleString()}
														</div>
													</div>
													<div class="bg-base-100 rounded p-3 border border-base-300">
														<div class="text-xs opacity-70 mb-1">Total Cost</div>
														<div class="text-lg font-bold">
															{(gemData.gemPrice + gemData.goldBarPrice).toLocaleString()}
														</div>
													</div>
													<div class="bg-base-100 rounded p-3 border border-base-300">
														<div class="text-xs opacity-70 mb-1">Crafted Item Price</div>
														<div class="text-lg font-bold text-secondary">
															{item.craftedPrice.toLocaleString()}
														</div>
													</div>
												</div>

												<div class="divider my-2"></div>

												<div class="grid grid-cols-2 gap-4">
													<div
														class="bg-success/10 rounded p-3 border border-success/30"
													>
														<div class="text-xs opacity-70 mb-1">Profit Per Item</div>
														<div
															class="text-lg font-bold {item.profitFlat >= 0 ? 'text-success' : 'text-error'}"
														>
															{item.profitFlat.toLocaleString()} gp
														</div>
													</div>
													<div
														class="bg-success/10 rounded p-3 border border-success/30"
													>
														<div class="text-xs opacity-70 mb-1">Profit Margin</div>
														<div
															class="text-lg font-bold {item.profitPct >= 0 ? 'text-success' : 'text-error'}"
														>
															{item.profitPct >= 0 ? "+" : ""}{item.profitPct.toFixed(1)}%
														</div>
													</div>
												</div>

												{#if item.volume > 0}
													<div class="bg-base-200 rounded p-3 text-sm">
														<div class="opacity-70">24h Volume: {Math.round(item.volume).toLocaleString()} crafted/day</div>
														<div class="mt-2 text-xs opacity-70">
															Potential daily profit: {(item.profitFlat * item.volume).toLocaleString()} GP/day
														</div>
													</div>
												{/if}
											</div>
										</CollapsibleItem>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{:catch error}
			<ErrorAlert message={`Failed to load prices: ${error.message}`} />
		{/await}
	</div>
</div>
