<script>
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import { fetchAlchPrices } from "$lib/alchingApi.js";
	import CollapsibleItem from "$lib/components/CollapsibleItem.svelte";

	let { data, form } = $props();
	let alchPrices = $state(data.alchPrices || {});
	let loading = $state(false);
	let error = $state(data.error || null);
	let isInitialLoad = $state(true);
	let visibleCount = $state(50);
	let scrollContainer = $state(null);
	let sortedItemsList = $state([]);

	onMount(async () => {
		try {
			const prices = await fetchAlchPrices();
			alchPrices = prices;
			sortedItemsList = Object.values(prices).sort(
				(a, b) =>
					(b.profitHighFlat || -Infinity) - (a.profitHighFlat || -Infinity),
			);
			isInitialLoad = false;
		} catch (err) {
			error = err.message;
			isInitialLoad = false;
		}
	});

	$effect(() => {
		if (form?.success && form?.alchPrices) {
			alchPrices = form.alchPrices;
			sortedItemsList = Object.values(form.alchPrices).sort(
				(a, b) =>
					(b.profitHighFlat || -Infinity) - (a.profitHighFlat || -Infinity),
			);
			isInitialLoad = false;
		} else if (form?.error) {
			error = form.error;
			isInitialLoad = false;
		}
	});

	function handleScroll(e) {
		if (!scrollContainer) return;

		const element = scrollContainer;
		const scrollTop = element.scrollTop;
		const scrollHeight = element.scrollHeight;
		const clientHeight = element.clientHeight;
		const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

		// Load more items when user scrolls past 70% of the list
		if (scrollPercentage > 0.7) {
			visibleCount = Math.min(sortedItemsList.length, visibleCount + 50);
		}
	}

	function getVisibleItems() {
		return sortedItemsList.slice(0, visibleCount);
	}
</script>

<svelte:head>
	<title>Alching - OSRS Trade</title>
</svelte:head>

<div class="min-h-screen bg-base-100 py-8 px-4">
	<div class="container mx-auto max-w-3xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2">Alching</h1>
			<p class="text-base-content/70">
				Buy items cheap and alch them for profit
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
		{:else if Object.keys(alchPrices).length > 0}
			<div class="mb-4 text-sm opacity-70">
				Showing {visibleCount} of {sortedItemsList.length} items
				{#if visibleCount < sortedItemsList.length}
					<span class="ml-2 text-info">• Scroll down to load more</span>
				{/if}
			</div>

			<div
				class="space-y-2 h-[calc(100vh-300px)] overflow-y-auto border border-base-300 rounded"
				onscroll={handleScroll}
				bind:this={scrollContainer}
			>
				<div class="space-y-2 p-2">
					{#each getVisibleItems() as item (item.itemId)}
						<CollapsibleItem
							title={item.name}
							mainPrice={item.gePrice}
							secondaryPrice={item.highAlch}
							profit={item.profitHigh}
							profitFlat={item.profitHighFlat}
							borderColor="border-base-300"
							buyLimit={item.buyLimit}
						>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-4">
									<div class="bg-base-100 rounded p-3 border border-base-300">
										<div class="text-xs opacity-70 mb-1">GE Buy Price</div>
										<div class="text-lg font-bold text-primary">
											{item.gePrice.toLocaleString()}
										</div>
										{#if item.volume > 0}
											<div class="text-xs opacity-70 mt-2">
												{Math.round(item.volume).toLocaleString()} vol/h
											</div>
										{/if}
									</div>

									<div class="bg-base-100 rounded p-3 border border-base-300">
										<div class="text-xs opacity-70 mb-1">
											Magic Level Required
										</div>
										<div class="text-lg font-bold text-secondary">55</div>
									</div>
								</div>

								{#if item.buyLimit > 0}
									<div
										class="bg-warning/10 rounded p-3 border border-warning/30"
									>
										<div class="text-xs opacity-70 mb-1">GE Buy Limit</div>
										<div class="text-lg font-bold text-warning">
											{item.buyLimit.toLocaleString()} items / 4 hours
										</div>
									</div>
								{/if}

								<div class="divider my-2"></div>

								<!-- High Alch -->
								<div class="space-y-2">
									<h3 class="font-semibold text-sm opacity-90">High Alchemy</h3>
									<div class="grid grid-cols-2 gap-4">
										<div
											class="bg-success/10 rounded p-3 border border-success/30"
										>
											<div class="text-xs opacity-70 mb-1">High Alch Value</div>
											<div class="text-lg font-bold text-success">
												{item.highAlch.toLocaleString()}
											</div>
										</div>
										<div
											class="bg-success/10 rounded p-3 border border-success/30"
										>
											<div class="text-xs opacity-70 mb-1">Profit Per Item</div>
											<div class="text-lg font-bold text-success">
												{(item.highAlch - item.gePrice).toLocaleString()} gp
											</div>
										</div>
									</div>
									{#if item.profitHigh !== null}
										<div class="text-xs opacity-70">
											{item.profitHigh >= 0 ? "+" : ""}{item.profitHigh.toFixed(
												1,
											)}%
										</div>
									{/if}
								</div>

								<!-- Low Alch -->
								{#if item.lowAlch > 0}
									<div class="space-y-2">
										<h3 class="font-semibold text-sm opacity-90">
											Low Alchemy
										</h3>
										<div class="grid grid-cols-2 gap-4">
											<div class="bg-info/10 rounded p-3 border border-info/30">
												<div class="text-xs opacity-70 mb-1">
													Low Alch Value
												</div>
												<div class="text-lg font-bold text-info">
													{item.lowAlch.toLocaleString()}
												</div>
											</div>
											<div class="bg-info/10 rounded p-3 border border-info/30">
												<div class="text-xs opacity-70 mb-1">
													Profit Per Item
												</div>
												<div class="text-lg font-bold text-info">
													{(item.lowAlch - item.gePrice).toLocaleString()} gp
												</div>
											</div>
										</div>
										{#if item.profitLow !== null}
											<div class="text-xs opacity-70">
												{item.profitLow >= 0 ? "+" : ""}{item.profitLow.toFixed(
													1,
												)}%
											</div>
										{/if}
									</div>
								{/if}

								<div class="text-xs opacity-60 text-center py-2">
									Fire rune cost: ~5gp (negligible)
								</div>

								{#if item.members}
									<div class="bg-yellow-400/20 rounded p-2">
										<div class="text-xs opacity-70">Members Only</div>
									</div>
								{/if}
							</div>
						</CollapsibleItem>
					{/each}

					<!-- Load more indicator -->
					{#if visibleCount < sortedItemsList.length}
						<div class="flex justify-center py-8">
							<div class="text-center opacity-60">
								<div class="text-sm mb-2">
									Scroll down to load more items...
								</div>
								<div class="loading loading-dots loading-sm"></div>
							</div>
						</div>
					{:else}
						<div class="flex justify-center py-8">
							<div class="text-sm opacity-60">End of list</div>
						</div>
					{/if}
				</div>
			</div>
		{:else if !loading && !error}
			<div class="alert alert-info">
				<span>No price data loaded. Click "Refresh Prices" to fetch data.</span>
			</div>
		{/if}
	</div>
</div>
