<script>
	let {
		title = "",
		mainPrice = null,
		secondaryPrice = null,
		volume = null,
		profit = null,
		profitFlat = null,
		subtitle = null,
		buyLimit = null,
		children,
	} = $props();

	let showCopyFeedback = $state(false);

	function getVolumeColor(vol) {
		if (!vol) return "text-base-content";
		if (vol < 1000) {
			return "text-error";
		} else if (vol < 3000) {
			return "text-warning";
		} else {
			return "text-success";
		}
	}

	function copyToClipboard() {
		try {
			navigator.clipboard.writeText(title);
			showCopyFeedback = true;
			setTimeout(() => {
				showCopyFeedback = false;
			}, 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}
</script>

<div class="flex items-center gap-2">
	<div class="collapse collapse-arrow border-2 border-base-300 flex-1">
		<input type="checkbox" />
		<div class="collapse-title font-semibold flex items-center justify-between">
			<div class="flex items-center gap-3">
				<span>{title}</span>
				{#if subtitle}
					<span class="badge badge-sm badge-outline">{subtitle}</span>
				{/if}
				{#if buyLimit && buyLimit > 0 && typeof buyLimit === "number"}
					<span class="badge badge-sm badge-warning">Limit: {buyLimit}</span>
				{/if}
				{#if mainPrice !== null && secondaryPrice !== null && typeof mainPrice === "number" && typeof secondaryPrice === "number"}
					<span class="text-xs opacity-70">
						{mainPrice.toLocaleString()} → {secondaryPrice.toLocaleString()}
					</span>
				{/if}
				{#if volume && typeof volume === "number"}
					<span class="text-xs font-semibold {getVolumeColor(volume)}">
						{Math.round(volume).toLocaleString()} vol/h
					</span>
				{/if}
			</div>
			{#if profit !== null || profitFlat !== null}
				<div class="flex flex-col items-end gap-1">
					{#if profitFlat !== null && typeof profitFlat === "number"}
						<span
							class="text-xs font-semibold {profitFlat >= 0
								? 'text-success'
								: 'text-error'}"
						>
							{profitFlat > 0 ? "+" : ""}{Math.round(
								profitFlat,
							).toLocaleString()} gp
						</span>
					{/if}
					{#if profit !== null && typeof profit === "number"}
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
	<button
		type="button"
		class="btn btn-ghost btn-xs opacity-60 hover:opacity-100 transition-opacity relative"
		title="Copy item name"
		onclick={copyToClipboard}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-4 w-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path
				d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
			></path>
			<rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
		</svg>
		{#if showCopyFeedback}
			<span
				class="absolute right-0 bg-success text-success-content text-xs border-1 px-2 py-1 rounded whitespace-nowrap"
			>
				Copied '{title}'
			</span>
		{/if}
	</button>
</div>
