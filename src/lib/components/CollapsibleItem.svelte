<script>
	/**
	 * Reusable collapsible item component
	 * @param {string} title - Main title text
	 * @param {string} borderColor - Border color class (e.g., 'border-red-400')
	 * @param {number} mainPrice - Left price to display
	 * @param {number} secondaryPrice - Right price to display
	 * @param {number} volume - Volume per hour
	 * @param {number} profit - Profit percentage
	 * @param {Array} details - Array of detail items to display (optional)
	 * @param {string} slot} - Slot for custom content
	 */

	let {
		title = "",
		mainPrice = null,
		secondaryPrice = null,
		volume = null,
		profit = null,
		profitFlat = null,
		subtitle = null,
		buyLimit = null,
		children
	} = $props();

	function getVolumeColor(vol) {
		if (!vol) return 'text-base-content';
		if (vol < 1000) {
			return 'text-error';
		} else if (vol < 3000) {
			return 'text-warning';
		} else {
			return 'text-success';
		}
	}
</script>

<div class="collapse collapse-arrow border-2 border-base-300">
	<input type="checkbox" />
	<div class="collapse-title font-semibold flex items-center justify-between">
		<div class="flex items-center gap-3">
			<span>{title}</span>
			{#if subtitle}
				<span class="badge badge-sm badge-outline">{subtitle}</span>
			{/if}
			{#if buyLimit && buyLimit > 0}
				<span class="badge badge-sm badge-warning">Limit: {buyLimit}</span>
			{/if}
			{#if mainPrice !== null && secondaryPrice !== null}
				<span class="text-xs opacity-70">
					{mainPrice.toLocaleString()} → {secondaryPrice.toLocaleString()}
				</span>
			{/if}
			{#if volume}
				<span class="text-xs font-semibold {getVolumeColor(volume)}">
					{Math.round(volume).toLocaleString()} vol/h
				</span>
			{/if}
		</div>
		{#if profit !== null || profitFlat !== null}
			<div class="flex flex-col items-end gap-1">
				{#if profitFlat !== null}
					<span class="text-xs font-semibold {profitFlat >= 0 ? 'text-success' : 'text-error'}">
						{profitFlat > 0 ? "+" : ""}{Math.round(profitFlat).toLocaleString()} gp
					</span>
				{/if}
				{#if profit !== null}
					<span class="badge {profit >= 0 ? 'badge-success' : 'badge-error'}">
						{profit > 0 ? "+" : ""}{profit.toFixed(1)}%
					</span>
				{/if}
			</div>
		{/if}
	</div>
	<div class="collapse-content">
		{@render children?.()}
	</div>
</div>
