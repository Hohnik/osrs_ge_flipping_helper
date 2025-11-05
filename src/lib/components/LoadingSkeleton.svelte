<script>
	let { count = 8 } = $props();
</script>

<div class="space-y-2">
	{#each Array(count) as _}
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
