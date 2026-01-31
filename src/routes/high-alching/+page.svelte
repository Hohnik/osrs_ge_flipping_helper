<script>
	import RefreshButton from '$lib/components/RefreshButton.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import CollapsibleItem from "$lib/components/CollapsibleItem.svelte";
	import { sortByProfitFlat } from '$lib/helpers.js';

	let { data, form } = $props();
	let loading = $state(false);
	let error = $state(null);
	let visibleCount = $state(50);
	let scrollContainer = $state(null);

	$effect(() => {
		if (form?.error) {
			error = form.error;
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

	$effect(() => {
		if (form?.success) {
			visibleCount = 50;
		}
	});
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

		<!-- Refresh Button -->
		<div class="mb-6">
			<RefreshButton bind:loading />
		</div>

		<ErrorAlert message={error} />

		{#await data.streamed.alchPrices}
			<LoadingSkeleton />
		{:then result}
			{#if result.error}
				<ErrorAlert message={result.error} />
			{:else}
				{@const sortedItemsList = Object.values(result).sort(
					(a, b) =>
						(b.profitHighFlat || -Infinity) - (a.profitHighFlat || -Infinity),
				)}

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
						{#each sortedItemsList.slice(0, visibleCount) as item (item.itemId)}
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
												{item.gePrice ? item.gePrice.toLocaleString() : 'N/A'}
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
													{item.highAlch ? item.highAlch.toLocaleString() : 'N/A'}
												</div>
											</div>
											<div
												class="bg-success/10 rounded p-3 border border-success/30"
											>
												<div class="text-xs opacity-70 mb-1">Profit Per Item</div>
												<div class="text-lg font-bold text-success">
													{(item.highAlch && item.gePrice) ? (item.highAlch - item.gePrice).toLocaleString() : 'N/A'} gp
												</div>
											</div>
										</div>
										{#if item.profitHigh !== null && typeof item.profitHigh === 'number'}
											<div class="text-xs opacity-70">
												{item.profitHigh >= 0 ? "+" : ""}{item.profitHigh.toFixed(1)}%
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
														{item.lowAlch ? item.lowAlch.toLocaleString() : 'N/A'}
													</div>
												</div>
												<div class="bg-info/10 rounded p-3 border border-info/30">
													<div class="text-xs opacity-70 mb-1">
														Profit Per Item
													</div>
													<div class="text-lg font-bold text-info">
														{(item.lowAlch && item.gePrice) ? (item.lowAlch - item.gePrice).toLocaleString() : 'N/A'} gp
													</div>
												</div>
											</div>
											{#if item.profitLow !== null && typeof item.profitLow === 'number'}
												<div class="text-xs opacity-70">
													{item.profitLow >= 0 ? "+" : ""}{item.profitLow.toFixed(1)}%
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
			{/if}
		{:catch error}
			<ErrorAlert message={`Failed to load prices: ${error.message}`} />
		{/await}
	</div>
</div>
