<script>
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import { fetchJewelryProfits } from "$lib/jewelryApi.js";
	import CollapsibleItem from "$lib/components/CollapsibleItem.svelte";

	let { data, form } = $props();
	let jewelryData = $state(data.jewelryData || {});
	let loading = $state(false);
	let error = $state(data.error || null);
	let isInitialLoad = $state(true);

	onMount(async () => {
		try {
			const profits = await fetchJewelryProfits();
			jewelryData = profits;
			isInitialLoad = false;
		} catch (err) {
			error = err.message;
			isInitialLoad = false;
		}
	});

	$effect(() => {
		if (form?.success && form?.jewelryData) {
			jewelryData = form.jewelryData;
			isInitialLoad = false;
		} else if (form?.error) {
			error = form.error;
			isInitialLoad = false;
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

		{#if error}
			<div class="alert alert-error mb-6">
				<span>{error}</span>
			</div>
		{/if}

		<!-- Refresh Button -->
		<div class="mb-6">
			<form
				method="POST"
				action="?/refresh"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
			>
				<button type="submit" class="btn btn-primary gap-2" disabled={loading}>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					{loading ? "Refreshing..." : "Refresh Prices"}
				</button>
			</form>
		</div>

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

		<!-- Loading Skeleton -->
		{#if isInitialLoad && !error}
			<div class="space-y-2">
				{#each Array(8) as _}
					<div
						class="collapse collapse-arrow border-2 bg-base-200 border-base-300 animate-pulse"
					>
						<input type="checkbox" disabled />
						<div
							class="collapse-title font-semibold flex items-center justify-between"
						>
							<div class="flex items-center gap-3">
								<div class="h-4 bg-base-300 rounded w-32"></div>
								<div class="h-4 bg-base-300 rounded w-24"></div>
							</div>
							<div class="h-6 bg-base-300 rounded w-16"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if Object.keys(jewelryData).length > 0}
			<div class="space-y-4">
				{#each Object.entries(jewelryData) as [gemType, gemData] (gemType)}
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
		{:else if !loading && !error}
			<div class="alert alert-info">
				<span>No jewelry data loaded. Click "Refresh Prices" to fetch data.</span>
			</div>
		{/if}
	</div>
</div>
